package com.jobshield.backend.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import org.springframework.stereotype.Service;

@Service
public class UrlContentService {

    private final HttpClient httpClient;

    public UrlContentService() {

        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    public String extractText(String url) {

        try {

            URI uri = URI.create(url);

            String scheme = uri.getScheme();

            if (scheme == null ||
                    (!scheme.equalsIgnoreCase("http")
                    && !scheme.equalsIgnoreCase("https"))) {

                throw new RuntimeException(
                        "Only HTTP and HTTPS URLs are supported."
                );
            }

            HttpRequest request =
                    HttpRequest.newBuilder()
                            .uri(uri)
                            .timeout(Duration.ofSeconds(15))
                            .header(
                                    "User-Agent",
                                    "JobShield/1.0"
                            )
                            .GET()
                            .build();

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            if (response.statusCode() < 200 ||
                    response.statusCode() >= 400) {

                throw new RuntimeException(
                        "Unable to access the provided URL."
                );
            }

            String html = response.body();

            // Remove script and style content
            html = html.replaceAll(
                    "(?is)<script.*?>.*?</script>",
                    " "
            );

            html = html.replaceAll(
                    "(?is)<style.*?>.*?</style>",
                    " "
            );

            // Remove HTML comments
            html = html.replaceAll(
                    "(?s)<!--.*?-->",
                    " "
            );

            // Replace HTML tags with spaces
            String text = html.replaceAll(
                    "(?s)<[^>]*>",
                    " "
            );

            // Decode common HTML entities
            text = text
                    .replace("&nbsp;", " ")
                    .replace("&amp;", "&")
                    .replace("&lt;", "<")
                    .replace("&gt;", ">")
                    .replace("&quot;", "\"")
                    .replace("&#39;", "'");

            // Clean extra whitespace
            text = text
                    .replaceAll("\\s+", " ")
                    .trim();

            if (text.isEmpty()) {

                throw new RuntimeException(
                        "No readable job content found on this URL."
                );
            }

            // Prevent extremely large webpages from going into ML
            if (text.length() > 15000) {
                text = text.substring(0, 15000);
            }

            return text;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to extract content from the provided URL."
            );
        }
    }
}