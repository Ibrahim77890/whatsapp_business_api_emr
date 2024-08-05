import { NextRequest, NextResponse } from 'next/server';

// Define a handler type for middleware or edge API routes
type NextRequestHandler = (req: NextRequest) => Promise<NextResponse>;

// Error handling wrapper for Next.js Edge functions or middleware
export const withErrorHandler = (handler: NextRequestHandler): NextRequestHandler => 
  async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Call the actual handler
      return await handler(req);
    } catch (error) {
      console.error('Error:', error);
      // Handle the error and return a NextResponse
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
