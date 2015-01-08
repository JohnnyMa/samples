package flow.js.upload;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.nio.file.FileSystem;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 *
 * This is a servlet demo,  for using flow.js to upload files.
 *
 * by fanxu123
 */
public class UploadServlet extends HttpServlet {
    /**
     * 
     */
    private static final long serialVersionUID = 4902583334059940165L;
    public static String UPLOAD_DIR;

    static {
        if (SystemUtils.isWindows()) {
            UPLOAD_DIR = SystemUtils.OS_TMP_DIR;
        } else {
            UPLOAD_DIR = "/tmp/tmp-test-upload";
        }
    }

    private long getContentLength(HttpServletRequest request) {
        long size = -1;
        try {
          size = Long.parseLong(request.getHeader("Content-Length"));
        } catch (NumberFormatException e) {
        }
        return size;
      }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int flowChunkNumber        = getFlowChunkNumber(request);

        FlowInfo info = getFlowInfo(request);

        RandomAccessFile raf = new RandomAccessFile(info.flowFilePath, "rw");

        //Seek to position
        raf.seek((flowChunkNumber - 1) * (long)info.flowChunkSize);

        //Save to file
        InputStream is = request.getInputStream();
        long readed = 0;
        long content_length = getContentLength(request);
        byte[] bytes = new byte[1024 * 4];
        while(readed < content_length) {
            int r = is.read(bytes);
            if (r < 0)  {
                break;
            }
            raf.write(bytes, 0, r);
            readed += r;
        }
        raf.close();


        //Mark as uploaded.
        info.uploadedChunks.add(new FlowInfo.FlowChunkNumber(flowChunkNumber));
        if (info.checkIfUploadFinished()) { //Check if all chunks uploaded, and change filename
            FlowInfoStorage.getInstance().remove(info);
            response.getWriter().print("All finished.");
        } else {
            response.getWriter().print("Upload");
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int flowChunkNumber        = getFlowChunkNumber(request);

        FlowInfo info = getFlowInfo(request);

        if (info.uploadedChunks.contains(new FlowInfo.FlowChunkNumber(flowChunkNumber))) {
            response.getWriter().print("Uploaded."); //This Chunk has been Uploaded.
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    private int getFlowChunkNumber(HttpServletRequest request) {
        return HttpUtils.toInt(request.getParameter("flowChunkNumber"), -1);
    }

    private FlowInfo getFlowInfo(HttpServletRequest request) throws ServletException {
        String base_dir = UPLOAD_DIR;

        int flowChunkSize          = HttpUtils.toLong(request.getParameter("flowChunkSize"), -1);
        long flowTotalSize         = HttpUtils.toLong(request.getParameter("flowTotalSize"), -1);
        String flowIdentifier      = request.getParameter("flowIdentifier");
        String flowFilename        = request.getParameter("flowFilename");
        String flowRelativePath    = request.getParameter("flowRelativePath");
        //Here we add a ".temp" to every upload file to indicate NON-FINISHED
        String flowFilePath        = new File(base_dir, flowFilename + '-' + flowIdentifier).getAbsolutePath() + ".temp";

        FlowInfoStorage storage = FlowInfoStorage.getInstance();

        FlowInfo info = storage.get(flowChunkSize, flowTotalSize,
                flowIdentifier, flowFilename, flowRelativePath, flowFilePath);
        if (!info.vaild())         {
            storage.remove(info);
            throw new ServletException("Invalid request params.");
        }
        return info;
    }
}
