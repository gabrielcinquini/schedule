import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  username: z
    .string()
    .min(3, "Mínimo de 3 caracteres")
    .regex(/^([a-z]|[0-9])+$/, "Formato inválido"),
  name: z
    .string()
    .regex(/^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/, "Nome inválido(Joe)"),
  lastName: z
    .string()
    .regex(
      /^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/,
      "Sobrenome inválido(Silva)"
    ),
  password: z.string().min(1, "Mínimo de 1 caracter"),
  provider: z.string().regex(/^[a-z]+$/, "Formato inválido"),
  createdAt: z.string(),
  lastLogin: z.string(),
});
export type UserSchemaType = z.infer<typeof userSchema>;

export const loginUserFormSchema = userSchema.pick({
  username: true,
  password: true,
});
export type LoginUserType = z.infer<typeof loginUserFormSchema>;

export const useMeSchema = userSchema.pick({
  id: true,
  username: true,
  name: true,
  lastName: true,
  provider: true,
});
export type UseMeType = z.infer<typeof useMeSchema>;

export const registerUserFormSchema = z
  .object({
    username: z
      .string()
      .min(3, "Mínimo de 3 caracteres")
      .regex(/^([a-z]|[0-9])+$/, "Formato inválido"),
    name: z
      .string()
      .regex(/^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/, "Nome inválido(Joe)"),
    lastName: z
      .string()
      .regex(
        /^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/,
        "Sobrenome inválido(Silva)"
      ),
    password: z.string().min(5, "Mínimo de 5 caracteres"),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      if (data.password !== data.confirmPassword) return false;
      return true;
    },
    {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    }
  );
export type RegisterUserType = z.infer<typeof registerUserFormSchema>;

export const scheduleSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .regex(/^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/, "Nome inválido(Joe)"),
  lastName: z
    .string()
    .regex(
      /^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/,
      "Sobrenome inválido(Silva)"
    ),
  date: z.coerce.date(),
  value: z.coerce.number(),
  patientId: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z.coerce.date(),
});
export type ScheduleType = z.infer<typeof scheduleSchema>;

export const schedulePostSchema = scheduleSchema.pick({
  name: true,
  lastName: true,
  date: true,
  time: true,
  value: true,
  userId: true,
  patientId: true,
});
export type SchedulePostSchema = z.infer<typeof schedulePostSchema>;

export const registerToScheduleFormSchema = z
  .object({
    // fullName: z
    //   .string()
    //   .min(4, "O nome deve conter ao menos 4 caracteres")
    //   .regex(/^[A-Z][a-z]+ [A-z][a-z]+$/, "Nome inválido(Joe)"),
    date: z.date(),
    time: z.string().regex(/^[0-9]{2}:[0-9]{2}$/, "Formato inválido"),
    value: z.string().refine(
      (value) => {
        const transformedValue = value
          .replace(/\s/g, "")
          .replace("R$", "")
          .replace(",", ".");
        return parseFloat(transformedValue) >= 0;
      },
      {
        message: "Formato inválido: deve ser um valor monetário positivo",
        path: ["value"],
      }
    ),
    userId: z.string().uuid(),
    patientId: z.string().uuid(),
  })
  .refine(
    (data) => {
      let date = new Date(data.date);
      let hora = data.time;
      let [novaHora, novosMinutos] = hora.split(":");
      date.setHours(parseInt(novaHora, 10));
      date.setMinutes(parseInt(novosMinutos, 10));
      // const selectedDate = new Date(`${data.date} ${data.time}:00`);
      // console.log(new Date(data.date))
      // console.log(selectedDate)
      const currentDate = new Date();
      return date >= currentDate;
    },
    {
      message: "Só é possível realizar o agendamento para uma data futura",
      path: ["time"],
    }
  );
export type RegisterScheduleFormType = z.infer<
  typeof registerToScheduleFormSchema
>;

export const patientSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .regex(/^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/, "Nome inválido(Joe)"),
  lastName: z
    .string()
    .regex(
      /^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/,
      "Sobrenome inválido(Silva)"
    ),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato inválido(123.456.789-00)")
    .refine(
      (value) => {
        const cleanDigits = value.replace(/[^\d]/g, "");

        if (cleanDigits.length !== 11) {
          return false;
        }

        const calculateDigit = (digits: number[], weights: number[]) => {
          const sum = digits.reduce(
            (acc, digit, index) => acc + digit * weights[index],
            0
          );
          const result = sum % 11;
          return result < 2 ? 0 : 11 - result;
        };

        const cpfDigits = cleanDigits.slice(0, 9).split("").map(Number);
        const firstDigit = calculateDigit(
          cpfDigits,
          [10, 9, 8, 7, 6, 5, 4, 3, 2]
        );

        const cpfWithFirstDigit = cleanDigits
          .slice(0, 10)
          .split("")
          .map(Number);
        const lastDigit = calculateDigit(
          cpfWithFirstDigit,
          [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]
        );

        return (
          Number(cleanDigits[9]) === firstDigit &&
          Number(cleanDigits[10]) === lastDigit
        );
      },
      { message: "CPF inválido" }
    ),

  convenio: z.string().min(3, "Deve conter ao menos 3 caracteres"),
  lastConsult: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  userId: z.string().uuid(),
});
export type PatientType = z.infer<typeof patientSchema>;

export const registerPatientFormSchema = patientSchema.pick({
  name: true,
  lastName: true,
  cpf: true,
  convenio: true,
  userId: true,
});
export type RegisterPatientFormType = z.infer<typeof registerPatientFormSchema>;

export const serviceSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .regex(/^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/, "Nome inválido(Joe)"),
  lastName: z
    .string()
    .regex(
      /^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/,
      "Sobrenome inválido(Silva)"
    ),
  date: z.coerce.date(),
  value: z.number(),
  createdAt: z.coerce.date(),
  isComplete: z.boolean(),
  patientId: z.string().uuid(),
  userId: z.string().uuid(),
});
export type ServiceSchemaType = z.infer<typeof serviceSchema>;

export const serviceFormSchema = serviceSchema.pick({
  name: true,
  lastName: true,
  date: true,
  value: true,
  isComplete: true,
  patientId: true,
  userId: true,
});
export type ServiceFormSchemaType = z.infer<typeof serviceFormSchema>;

export const forgotPasswordFormSchema = z
  .object({
    id: z.string().uuid().optional(),
    newPassword: z.string().min(5, "Mínimo de 5 caracteres"),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      if (data.newPassword !== data.confirmPassword) return false;
      return true;
    },
    {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    }
  );

export type ForgotPasswordFormSchemaType = z.infer<
  typeof forgotPasswordFormSchema
>;
