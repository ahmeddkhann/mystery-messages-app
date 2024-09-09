"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {useDebounce} from "@uidotdev/usehooks"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { signUpSchema } from "@/app/schemas/signUpSchema"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/app/types/ApiResponse"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const page = () => {

  const [username, setUsername] = useState ("");
  const [usernameMessage, setUsernameMessage] = useState ("");
  const [isCheckingUsername, setIsCheckingUsername] = useState (false);
  const [isSubmitting, setIsSubmitting] = useState (false);
  const debouncedValue = useDebounce (username, 300);
  const { toast } = useToast()
  const router = useRouter()

  const register = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })


  useEffect (()=> {
    const checkUsernameUnique = async () => {
      if (debouncedValue){
        setUsernameMessage ("")
        setIsCheckingUsername (true)
        try {
          const response = await axios.get(`/api/check-username-unique?.username=${debouncedValue}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError <ApiResponse>
          const message = axiosError.response?.data.message
          setUsernameMessage ( message || "error checking username")
        }
        finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, 
  [debouncedValue])


  const onSubmit = async (data: z.infer <typeof signUpSchema>) => {
    setIsSubmitting (true)

    try {
      const response = await axios.post(`/api/sign-up`, data)
      toast ({
        title: "success",
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
    } 
    
    catch (error) {
      console.log("error in signup of a user", error);
      const axiosError = error as AxiosError <ApiResponse>
      const errorMessage = axiosError.response?.data.message
      
      toast ({
        title: "SignUp failed",
        description: errorMessage,
        variant: "destructive"
      })
    }
    finally{
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center 
    min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 
      bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold 
           tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
           </h1>
           <p className="mb-4">
            sign up to start your anonymous adventure
           </p>
        </div>

        <Form {...register}>
      <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-8">

        <FormField
          control={register.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username..." {...field}
                 onChange={(e) => {
                  field.onChange(e)
                  setUsername (e.target.value)
                 }}  />
              </FormControl>
              {isCheckingUsername && <Loader2 className="animate-spin"/>}
              <p className= {`text-sm ${usernameMessage === "username is available"? 
               "text-green-500": "text-red-500"}`}>
                {usernameMessage}
              </p>
              
              <FormDescription>
                enter your username
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

         <FormField
          control={register.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email..." {...field} />
              </FormControl>
              <FormDescription>
                enter your email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

         <FormField
          control={register.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password..." {...field} />
              </FormControl>
              <FormDescription>
                enter your password
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled= {isSubmitting} >
          {
            isSubmitting? (
              <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin"/>
              <span>Submitting...</span>
              </>
            ) : ("Signup")
          }
        </Button>
      </form>
    </Form>

    <div className="text-center mt-4">
      <p>Already a member? {' '} </p>
      <Link href={"/sign-in"} className="text-blue-400
       hover:text-blue-800"> Sign in</Link>
    </div>

      </div>
    </div>
  )
}

export default page