package com.finance;

import com.finance.service.parser.YahavPdfParser;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.io.RandomAccessReadBuffer;

import java.io.File;
import java.io.FileInputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PdfPrinter {
    public static void main(String[] args) throws Exception {
        File file = new File("/Users/igorkoishman/.gemini/antigravity-ide/brain/21ad9af3-0ebb-4ce9-9272-130a8bbdedf8/.user_uploaded/media_1788261164248.pdf");
        try (FileInputStream fis = new FileInputStream(file);
             PDDocument document = Loader.loadPDF(new RandomAccessReadBuffer(fis.readAllBytes()))) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            
            // Regex to capture amount, optional null, description, כן/לא, and date
            Pattern pattern = Pattern.compile("(\\d+\\.\\d{2})(null|.*?)(.*?)(?:כן|לא)(\\d{2}/\\d{2}/\\d{4})");
            
            java.nio.file.Files.writeString(java.nio.file.Paths.get("scratch/pdf_text.txt"), text);
        }
    }
}
