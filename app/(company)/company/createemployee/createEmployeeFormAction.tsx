"use server"
import { prisma } from "@/app/utils/db";
import { EmploymentType, WorkingStatus, ContractType } from "@prisma/client";

// Define a type for the incoming form
type EmployeeFormData = {
  companyId: string;
  name: string;
  email?: string;
  phone?: string;
  personalNumber: string;
  pinCode?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  contractType: ContractType;
  hourlyRate?: string;
  monthlySalary?: string;
  jobTitle?: string;
  workplace?: string;
  employmentType?: EmploymentType;
  workingStatus?: WorkingStatus;
  insurance?: boolean;
  insuranceCompany?: string;
  financialSupport?: boolean;
  companyCar?: boolean;
  mealAllowance?: boolean;
  unionFees?: boolean;
  netDeduction?: boolean;
  bankName?: string;
  clearingNumber?: string;
  accountNumber?: string;
  jobStartDate?: string;
  jobEndDate?: string;
};

export async function createEmployeeAction(form: EmployeeFormData) {
  "use server";

  try {
    const {
      companyId,
      name,
      email,
      phone,
      personalNumber,
      pinCode,
      address,
      city,
      postalCode,
      country,
      contractType,
      hourlyRate,
      monthlySalary,
      jobTitle,
      workplace,
      employmentType,
      workingStatus,
      insurance,
      insuranceCompany,
      financialSupport,
      companyCar,
      mealAllowance,
      unionFees,
      netDeduction,
      bankName,
      clearingNumber,
      accountNumber,
      jobStartDate,
      jobEndDate,
    } = form;

    // 1️⃣ Check if Person exists
    let person = await prisma.person.findUnique({
      where: { personalNumber },
    });

    if (!person) {
      person = await prisma.person.create({
        data: {
          name,
          email,
          phone,
          personalNumber,
          pinCode,
          address,
          city,
          postalCode,
          country,
          bankName,
          clearingNumber,
          accountNumber,
        },
      });
    }

    // 2️⃣ Create Employee
    await prisma.employee.create({
      data: {
        companyId,
        personId: person.id,
        contractType,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        monthlySalary: monthlySalary ? parseFloat(monthlySalary) : null,
        jobTitle,
        workplace,
        employmentType,
        workingStatus,
        insurance: !!insurance,
        insuranceCompany,
        financialSupport: !!financialSupport,
        companyCar: !!companyCar,
        mealAllowance: !!mealAllowance,
        unionFees: !!unionFees,
        netDeduction: !!netDeduction,
        jobStartDate: jobStartDate ? new Date(jobStartDate) : null,
        jobEndDate: jobEndDate ? new Date(jobEndDate) : null,
      },
    });

    return { success: true, message: "Employee created successfully" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message || "Failed to create employee" };
  }
}
