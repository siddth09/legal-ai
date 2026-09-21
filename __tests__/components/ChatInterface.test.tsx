import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatInterface from "@/components/ChatInterface";

const DOCUMENT_TEXT = "This is a Non-Disclosure Agreement. Section 5 prohibits sharing of confidential data.";
const DOCUMENT_NAME = "nda.pdf";

// Mock the fetch API
global.fetch = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe("ChatInterface", () => {
  it("renders initial welcome message from assistant", () => {
    render(<ChatInterface documentText={DOCUMENT_TEXT} documentName={DOCUMENT_NAME} />);
    expect(screen.getByText(/I've read your document.*nda\.pdf/i)).toBeInTheDocument();
  });

  it("renders suggested questions when no messages sent yet", () => {
    render(<ChatInterface documentText={DOCUMENT_TEXT} />);
    expect(screen.getByText(/Suggested questions/i)).toBeInTheDocument();
    expect(screen.getByText(/What are my main obligations/i)).toBeInTheDocument();
  });

  it("hides suggested questions after first user message", async () => {
    const mockResponse = {
      success: true,
      answer: {
        answer: "You must keep all information confidential.",
        relevantText: "Section 5 prohibits sharing",
        confidence: "high",
        disclaimer: "This is legal information, not advice.",
        followUpQuestions: [],
      },
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<ChatInterface documentText={DOCUMENT_TEXT} />);
    const input = screen.getByPlaceholderText(/Ask anything about this document/i);
    await userEvent.type(input, "What are my obligations?");
    fireEvent.click(screen.getByRole("button", { name: /Send question/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Suggested questions/i)).not.toBeInTheDocument();
    });
  });

  it("displays user message in the chat", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        answer: { answer: "AI answer", confidence: "high", disclaimer: "", followUpQuestions: [], relevantText: null },
      }),
    });

    render(<ChatInterface documentText={DOCUMENT_TEXT} />);
    const input = screen.getByPlaceholderText(/Ask anything about this document/i);
    await userEvent.type(input, "What is the term?");
    fireEvent.click(screen.getByRole("button", { name: /Send question/i }));
    expect(await screen.findByText("What is the term?")).toBeInTheDocument();
  });

  it("displays the AI response after submit", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        answer: { answer: "The term is 5 years.", confidence: "high", disclaimer: "", followUpQuestions: [], relevantText: null },
      }),
    });

    render(<ChatInterface documentText={DOCUMENT_TEXT} />);
    const input = screen.getByPlaceholderText(/Ask anything about this document/i);
    await userEvent.type(input, "What is the term?");
    fireEvent.click(screen.getByRole("button", { name: /Send question/i }));
    expect(await screen.findByText("The term is 5 years.")).toBeInTheDocument();
  });

  it("shows confidence badge in AI response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        answer: { answer: "The agreement lasts 5 years.", confidence: "high", disclaimer: "Not legal advice.", followUpQuestions: [], relevantText: null },
      }),
    });

    render(<ChatInterface documentText={DOCUMENT_TEXT} />);
    await userEvent.type(screen.getByPlaceholderText(/Ask anything/i), "Term?");
    fireEvent.click(screen.getByRole("button", { name: /Send question/i }));
    expect(await screen.findByText(/Confidence: high/i)).toBeInTheDocument();
  });

  it("displays an error message when API fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Service unavailable" }),
    });

    render(<ChatInterface documentText={DOCUMENT_TEXT} />);
    await userEvent.type(screen.getByPlaceholderText(/Ask anything/i), "Any question?");
    fireEvent.click(screen.getByRole("button", { name: /Send question/i }));
    expect(await screen.findByText(/Service unavailable/i)).toBeInTheDocument();
  });

  it("send button is disabled when input is empty", () => {
    render(<ChatInterface documentText={DOCUMENT_TEXT} />);
    expect(screen.getByRole("button", { name: /Send question/i })).toBeDisabled();
  });

  it("send button enables when user types", async () => {
    render(<ChatInterface documentText={DOCUMENT_TEXT} />);
    const input = screen.getByPlaceholderText(/Ask anything/i);
    await userEvent.type(input, "x");
    expect(screen.getByRole("button", { name: /Send question/i })).not.toBeDisabled();
  });

  it("clears input after sending", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        answer: { answer: "Reply.", confidence: "low", disclaimer: "", followUpQuestions: [], relevantText: null },
      }),
    });

    render(<ChatInterface documentText={DOCUMENT_TEXT} />);
    const input = screen.getByPlaceholderText(/Ask anything/i) as HTMLInputElement;
    await userEvent.type(input, "My question");
    fireEvent.click(screen.getByRole("button", { name: /Send question/i }));
    await waitFor(() => expect(input.value).toBe(""));
  });
});
