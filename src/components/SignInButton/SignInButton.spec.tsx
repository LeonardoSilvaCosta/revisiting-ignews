import { render, screen } from "@testing-library/react";
import { mocked } from 'jest-mock'
import { useSession } from "next-auth/react";
import { SignInButton } from ".";

jest.mock("next-auth/react");

describe("SignInButton Component", () => {
  it("renders correctly when user is not authenticated", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({data: null, status: 'unauthenticated'});

    render(<SignInButton />);

    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });

  it("renders correctly when user is authenticated", () => {
    render(<SignInButton />);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce(
      {data: { name: 'John Doe', email: 'johndoe@example.com', expires: 'fake-expires'}, status: 'authenticated' 
    });
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
