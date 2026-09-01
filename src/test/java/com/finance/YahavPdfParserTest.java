package com.finance;

import com.finance.service.parser.YahavPdfParser;
import org.junit.jupiter.api.Test;
import java.io.FileInputStream;
import java.io.File;

public class YahavPdfParserTest {

    @Test
    public void testParser() throws Exception {
        YahavPdfParser parser = new YahavPdfParser();
        File file = new File("/Users/igorkoishman/.gemini/antigravity-ide/brain/21ad9af3-0ebb-4ce9-9272-130a8bbdedf8/.user_uploaded/media_1788261164248.pdf");
        try (FileInputStream fis = new FileInputStream(file)) {
            var dtos = parser.parse(fis);
            System.out.println("Parsed " + dtos.size() + " dtos");
        }
    }
}
