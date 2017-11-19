package au.com.deloitte.platform;

import static spark.Spark.get;
import static spark.Spark.port;

class Main {

    public static final int HTTP_PORT = 8080;

    public static void main(String... args) {
        port(HTTP_PORT);
        get("/", (request, response) -> "");    // return HTTP 200
    }

}