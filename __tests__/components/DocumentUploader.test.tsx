import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DocumentUploader from "@/components/DocumentUploader";

describe("DocumentUploader", () => {
  const onFile = jest.fn();
  const onClear = jest.fn();

  beforeEach(() => {
    onFile.mockClear();
    onClear.mockClear();
  });

  it("renders the upload zone with label", () => {
    render(<DocumentUploader id="test" label="Test document" onFile={onFile} />);
    expect(screen.getByText("Test document")).toBeInTheDocument();
    expect(screen.getByText(/Drag & drop or click to upload/i)).toBeInTheDocument();
  });

  it("shows file type hint text", () => {
    render(<DocumentUploader id="test" label="Test" onFile={onFile} />);
    expect(screen.getByText(/PDF, TXT, or MD/i)).toBeInTheDocument();
  });

  it("displays current file name when currentFile is provided", () => {
    const file = new File(["content"], "contract.pdf", { type: "application/pdf" });
    render(<DocumentUploader id="test" label="Test" onFile={onFile} currentFile={file} onClear={onClear} />);
    expect(screen.getByText("contract.pdf")).toBeInTheDocument();
  });

  it("calls onClear when remove button is clicked", () => {
    const file = new File(["content"], "contract.pdf", { type: "application/pdf" });
    render(<DocumentUploader id="test" label="Test" onFile={onFile} currentFile={file} onClear={onClear} />);
    fireEvent.click(screen.getByRole("button", { name: /remove contract\.pdf/i }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("shows error for oversized file", async () => {
    const user = userEvent.setup();
    render(<DocumentUploader id="test" label="Test" onFile={onFile} />);
    const input = screen.getByLabelText(/File input for Test/i);
    // Create a file slightly over 5 MB
    const bigFile = new File(["x".repeat(6 * 1024 * 1024)], "big.pdf", { type: "application/pdf" });
    Object.defineProperty(bigFile, "size", { value: 6 * 1024 * 1024 });
    await user.upload(input, bigFile);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/too large/i);
    });
    expect(onFile).not.toHaveBeenCalled();
  });

  it("shows error for unsupported file type", async () => {
    render(<DocumentUploader id="test" label="Test" onFile={onFile} />);
    const input = screen.getByLabelText(/File input for Test/i);
    // Use fireEvent to bypass the accept attribute filter in userEvent.upload
    const badFile = new File(["content"], "report.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    Object.defineProperty(input, "files", {
      value: [badFile],
      configurable: true,
    });
    fireEvent.change(input);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/Only PDF, TXT, or MD/i);
    });
  });

  it("calls onFile for a valid PDF", async () => {
    const user = userEvent.setup();
    render(<DocumentUploader id="test" label="Test" onFile={onFile} />);
    const input = screen.getByLabelText(/File input for Test/i);
    const validFile = new File(["pdf content"], "valid.pdf", { type: "application/pdf" });
    await user.upload(input, validFile);
    await waitFor(() => {
      expect(onFile).toHaveBeenCalledWith(validFile);
    });
  });

  it("calls onText with sample NDA when 'load sample NDA' is clicked", () => {
    const onText = jest.fn();
    render(<DocumentUploader id="test" label="Test" onFile={onFile} onText={onText} />);
    fireEvent.click(screen.getByRole("button", { name: /load sample NDA/i }));
    expect(onText).toHaveBeenCalledTimes(1);
    expect(onText.mock.calls[0][0]).toContain("NON-DISCLOSURE AGREEMENT");
  });

  it("is keyboard accessible — Enter key triggers file input click", () => {
    render(<DocumentUploader id="test" label="Test" onFile={onFile} />);
    const zone = screen.getByRole("button", { name: /upload area for Test/i });
    const clickSpy = jest.spyOn(HTMLInputElement.prototype, "click");
    fireEvent.keyDown(zone, { key: "Enter" });
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it("has aria-invalid when there is an error", async () => {
    const user = userEvent.setup();
    render(<DocumentUploader id="test" label="Test" onFile={onFile} />);
    const input = screen.getByLabelText(/File input for Test/i);
    const badFile = new File(["x".repeat(6 * 1024 * 1024)], "big.pdf", { type: "application/pdf" });
    Object.defineProperty(badFile, "size", { value: 6 * 1024 * 1024 });
    await user.upload(input, badFile);
    await waitFor(() => {
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });
});
