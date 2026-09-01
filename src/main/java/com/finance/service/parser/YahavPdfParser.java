package com.finance.service.parser;

import com.finance.dto.PendingTransactionDTO;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class YahavPdfParser implements PdfParser {

    // Regex to capture amount (optional negative), optional null, description,
    // כן/לא, and date from the Hebrew PDF text output
    private static final Pattern TRANSACTION_PATTERN = Pattern
            .compile("(-?\\d+\\.\\d{2})(null|.*?)(.*?)(?:כן|לא)(\\d{2}/\\d{2}/\\d{4})");

    @Override
    public boolean supports(String sourceType) {
        return "YAHAV_CREDIT".equalsIgnoreCase(sourceType);
    }

    @Override
    public List<PendingTransactionDTO> parse(InputStream pdfStream) throws Exception {
        List<PendingTransactionDTO> transactions = new ArrayList<>();

        try (PDDocument document = Loader.loadPDF(new RandomAccessReadBuffer(pdfStream.readAllBytes()))) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            String[] lines = text.split("\\r?\\n");
            for (String line : lines) {
                Matcher matcher = TRANSACTION_PATTERN.matcher(line);
                if (matcher.find()) {
                    String amountStr = matcher.group(1);
                    String extraInfo = matcher.group(2).trim(); // This might contain installments info
                    String description = matcher.group(3).trim();
                    String dateStr = matcher.group(4);

                    PendingTransactionDTO dto = new PendingTransactionDTO();

                    // Here we extract the month and year from the parsed date
                    String[] dateParts = dateStr.split("/");
                    int month = Integer.parseInt(dateParts[1]);
                    int year = Integer.parseInt(dateParts[2]);

                    dto.setTxnMonth(LocalDate.of(year, month, 1));

                    // Simple Hebrew month mapping for sheetName
                    String[] hebrewMonths = { "", "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט",
                            "ספטמבר", "אוקטובר", "נובמבר", "דצמבר" };
                    if (month >= 1 && month <= 12) {
                        dto.setSheetName(hebrewMonths[month]);
                    }

                    boolean isIncome = false;

                    // Due to Hebrew RTL extraction, the minus sign might end up attached to the
                    // description
                    if (description.endsWith("-")) {
                        isIncome = true;
                        description = description.substring(0, description.length() - 1).trim();
                    } else if (description.startsWith("-")) {
                        isIncome = true;
                        description = description.substring(1).trim();
                    }

                    if (amountStr.startsWith("-")) {
                        isIncome = true;
                        amountStr = amountStr.substring(1);
                    }

                    BigDecimal amount = new BigDecimal(amountStr);
                    if (isIncome) {
                        dto.setTxnType("income");
                        dto.setAmount(amount.negate()); // Negate it so it shows as negative for the user
                        dto.setCategory(null);
                        dto.setTopic(null);
                        dto.setPaymentMethod(null);
                        dto.setSourceName(description);
                    } else {
                        dto.setTxnType("expense");
                        dto.setAmount(amount);
                        dto.setCategory(description);
                        dto.setPaymentMethod("אשראי");
                        dto.setSourceName(null);
                    }

                    // Parse installments if present
                    if (!extraInfo.equals("null") && !extraInfo.isEmpty()) {
                        String[] parts = extraInfo.split("/");
                        if (parts.length == 2) {
                            try {
                                int p1 = Integer.parseInt(parts[0].trim());
                                int p2 = Integer.parseInt(parts[1].trim());
                                // in "36 / 27", 36 is total, 27 is current
                                int total = Math.max(p1, p2);
                                int current = Math.min(p1, p2);
                                dto.setInstallments(total);
                                dto.setInstallmentNo(current);
                                // Calculate remaining
                                int remaining = total - current;
                                dto.setRemainingAmount(amount.abs().multiply(new BigDecimal(remaining)));
                            } catch (NumberFormatException e) {
                                // ignore parse errors
                            }
                        }
                        
                        Pattern instPattern = Pattern.compile("(\\d+)\\s*מתוך\\s*(\\d+)");
                        Matcher instMatcher = instPattern.matcher(extraInfo);
                        if (instMatcher.find()) {
                            dto.setInstallmentNo(Integer.parseInt(instMatcher.group(1)));
                            dto.setInstallments(Integer.parseInt(instMatcher.group(2)));

                            dto.setRemainingAmount(
                                    dto.getAmount()
                                            .multiply(new BigDecimal(dto.getInstallments() - dto.getInstallmentNo())));
                        }
                    }

                    transactions.add(dto);
                }
            }
        }

        return transactions;
    }
}
