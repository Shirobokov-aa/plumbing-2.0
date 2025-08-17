import { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Вход в систему",
  description: "Страница входа в административную панель",
}

export default function LoginPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Вход в систему
          </h1>
          <p className="text-sm text-muted-foreground">
            Введите ваши учетные данные для входа
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
