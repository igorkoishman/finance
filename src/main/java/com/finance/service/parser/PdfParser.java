package com.finance.service.parser;

import com.finance.dto.PendingTransactionDTO;
import java.io.InputStream;
import java.util.List;

public interface PdfParser {
    List<PendingTransactionDTO> parse(InputStream pdfStream) throws Exception;
    boolean supports(String sourceType);
}
