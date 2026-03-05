import { z } from "zod";

export const categorySchema = z.object({
    categoryName: z.string().min(1, "Name is required"),
    isExpense: z.boolean().default(false),
    isIncome: z.boolean().default(false),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    logoPath: z.string().optional(),
});

export const projectSchema = z.object({
    projectName: z.string().min(1, "Name is required"),
    projectDetail: z.string().optional(),
    description: z.string().optional(),
    projectStartDate: z.date().optional().nullable(),
    projectEndDate: z.date().optional().nullable(),
    isActive: z.boolean().default(true),
    projectLogo: z.string().optional(),
});

export const expenseSchema = z.object({
    amount: z.coerce.number().min(0.01, "Amount must be positive"),
    expenseDate: z.date(),
    expenseDetail: z.string().optional(),
    description: z.string().optional(),
    attachmentPath: z.string().optional(),
    categoryId: z.coerce.number().optional().nullable(),
    subCategoryId: z.coerce.number().optional().nullable(),
    projectId: z.coerce.number().optional().nullable(),
    peopleId: z.coerce.number().min(1, "Payee/Payer is required"),
});

export const incomeSchema = z.object({
    amount: z.coerce.number().min(0.01, "Amount must be positive"),
    incomeDate: z.date(),
    incomeDetail: z.string().optional(),
    description: z.string().optional(),
    attachmentPath: z.string().optional(),
    categoryId: z.coerce.number().optional().nullable(),
    subCategoryId: z.coerce.number().optional().nullable(),
    projectId: z.coerce.number().optional().nullable(),
    peopleId: z.coerce.number().min(1, "Payer is required"),
});

export const budgetSchema = z.object({
    amount: z.coerce.number().min(0.01, "Amount must be positive"),
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(2000).max(2100),
    categoryId: z.coerce.number().optional().nullable(),
});

export const subCategorySchema = z.object({
    subCategoryName: z.string().min(1, "Name is required"),
    categoryId: z.coerce.number().min(1, "Category is required"),
    isActive: z.boolean().default(true),
    logoPath: z.string().optional(),
});

export const peopleSchema = z.object({
    peopleName: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    password: z.string().optional(), // Admin sets initial password
    mobileNo: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    profileImage: z.string().optional(),
});
