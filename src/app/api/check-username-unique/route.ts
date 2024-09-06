import dbConnect from "@/app/lib/dbConnect";
import { z } from "zod";
import userModel from "@/app/models/user";
import { usernameValidation } from "@/app/schemas/signUpSchema";
