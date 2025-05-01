"use client";

import { z } from 'zod';
import { PropertyType, ServiceType, MaterialType, ShowerIssue, WaterHeaterType, PlumbingCondition, ProjectType } from '../context/EstimatorContext';

// Custom validator function for type-safe enums
const customTypeValidator = <T>(type: string) => {
  return z.string().refine(val => true, {
    message: `Please select a ${type}`
  });
};

// Define schema for each step
export const stepSchemas = {
  propertyType: z.object({
    propertyType: customTypeValidator<PropertyType>('property type'),
  }),
  
  serviceType: z.object({
    serviceType: customTypeValidator<ServiceType>('service type'),
  }),
  
  materials: z.object({
    materials: z.array(z.string())
      .min(1, { message: "Select at least one material type" }),
  }),
  
  projectDetails: z.object({
    projectDetails: z.string()
      .max(1000, { message: "Project details must be 1000 characters or less" })
      .optional(), // Make project details optional
  }),
  
  contactInfo: z.object({
    fullName: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Valid email is required" }),
    phone: z.string()
      .min(10, { message: "Please enter a valid phone number" })
      .regex(/^[0-9()-.\s]+$/, { message: "Please enter a valid phone number" }),
    address: z.string().min(1, { message: "Address is required" }),
    zipCode: z.string()
      .min(5, { message: "ZIP code should be 5 digits" })
      .max(5, { message: "ZIP code should be 5 digits" })
      .regex(/^\d{5}$/, { message: "ZIP code should be 5 digits" }),
  }),
  
  showerIssues: z.object({
    showerIssues: z.array(z.string())
      .min(1, { message: "Please select at least one option" }),
  }),
  
  waterHeater: z.object({
    existingWaterHeater: customTypeValidator<WaterHeaterType>('water heater type'),
  }),
  
  plumbingCondition: z.object({
    plumbingCondition: customTypeValidator<PlumbingCondition>('plumbing condition'),
  }),
  
  existingBathtub: z.object({
    hasExistingBathtub: z.boolean({
      required_error: "Please select Yes or No"
    }),
  }),
  
  projectType: z.object({
    projectType: customTypeValidator<ProjectType>('project type'),
  }),
};

// Function to get schema for a specific step
export function getSchemaForStep(stepId: string) {
  // Handle the case where the step might not be in our schema (e.g., when steps are removed)
  if (!stepId || !(stepId in stepSchemas)) {
    return null;
  }
  
  return stepSchemas[stepId as keyof typeof stepSchemas];
}
