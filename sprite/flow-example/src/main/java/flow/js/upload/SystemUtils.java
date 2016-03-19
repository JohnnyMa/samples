package flow.js.upload;

public class SystemUtils {

    public static final String OS_NAME = System.getProperty("os.name");

    public static final String OS_TMP_DIR = System.getProperty("java.io.tmpdir");

    public static boolean isLinux() {
        return OS_NAME.toLowerCase().startsWith("linux");
    }

    public static boolean isWindows() {
        return OS_NAME.toLowerCase().startsWith("windows");
    }
}
