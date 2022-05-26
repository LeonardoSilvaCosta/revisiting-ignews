import { render, screen, fireEvent } from "@testing-library/react";
import { SubscribeButton } from ".";
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import { mocked } from 'jest-mock';

jest.mock("next-auth/react");
jest.mock("next/router");

describe("SubscribeButton Component", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({data: null, status: 'unauthenticated'});

    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({data: null, status: 'unauthenticated'});

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it('redirects to posts when user already has a subscription', () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce( {data: { name: 'John Doe', email: 'johndoe@example.com', expires: 'fake-expires'}, status: 'authenticated' 
  })

    const pushMock = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: jest.fn(),
    } as any)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith('/posts');
  })
});
