'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { db } from '@/lib/db'
import bcrypt from 'bcrypt'
import { z } from 'zod'

const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    registerType: z.enum(["USER", "PEOPLE"]).optional(),
    adminEmail: z.string().email().optional().or(z.literal('')),
})

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', { ...Object.fromEntries(formData), redirectTo: '/dashboard' })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
}

export async function register(prevState: string | undefined, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        registerType: formData.get('registerType'),
        adminEmail: formData.get('adminEmail'),
    })

    if (!validatedFields.success) {
        return 'Missing Fields or Invalid Data. Failed to Register.'
    }

    const { email, password, name, registerType, adminEmail } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        if (registerType === "PEOPLE") {
            // Employee Registration Logic
            if (!adminEmail) return "Admin Email is required for Employee registration."

            const adminUser = await db.user.findUnique({
                where: { emailAddress: adminEmail }
            })

            if (!adminUser) return "Admin not found with that email."

            // Check if email already exists in People
            const existingPerson = await db.people.findFirst({
                where: { email: email }
            })
            if (existingPerson) return "Email already registered."

            await db.people.create({
                data: {
                    peopleName: name,
                    email: email,
                    password: hashedPassword,
                    isActive: true,
                    userId: adminUser.userId, // Link to admin
                }
            })
            return "Employee account created successfully."
        } else {
            // Admin (User) Registration Logic
            // Check if user exists
            const existingUser = await db.user.findUnique({
                where: { emailAddress: email }
            })
            if (existingUser) return "Email already registered."

            await db.user.create({
                data: {
                    userName: name,
                    emailAddress: email,
                    password: hashedPassword,
                    mobileNo: '', // Optional or default
                    role: "USER" // Default to Admin/User role
                },
            })
            return "Admin account created successfully."
        }
    } catch (error) {
        console.error("Registration Error:", error)
        return 'Database Error: Failed to Create Account.'
    }
}
