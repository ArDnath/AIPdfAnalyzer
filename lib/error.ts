import {NextResponse} from "next/server";


export class ApiError extends Error {
  constructor(
    public statusCode : number,
    public message: string,
    public details?: any
  ){
    super(message)
  }
}

export const handleApiError =(error: unknown) : NextResponse =>{
  console.Error("API Error:", error)

  if(error instanceof ApiError){
      return NextResponse.json(
        { error: error.message}
        { status: 500}
      )
  }
  return NextResponse.json(
    {error: "unknown error occured"},
    { status: 500}
  )
}
