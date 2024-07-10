type FormInitialType<ErrorsType> = {
  status: "UNINITIALIZED";
  errors?: ErrorsType;
  message: string;
};

type FormSuccessType = {
  status: "SUCCESS";
  message: string;
};

type FormFailType<ErrorsType> = {
  status: "FAILED";
  errors?: ErrorsType;
  message: string;
};

type ProcedureStatus<SchemaType> = Promise<
  FormSuccessType |
  FormFailType<SchemaType>
>

type SimpleApiResType = {
  status: "SUCCESS" | "FAILED";
  message: string;
}

type CredsSignInErrorsType = {
  email?: string;
  password?: string;
}

type CredsSignInStatusType = Promise<
  FormInitialType<CredsSignInErrorsType> |
  FormSuccessType |
  FormFailType<CredsSignInErrorsType>
>

type CredsSignUpErrorsType = {
  name?: string;
  email?: string;
  password?: string;
}

type CredsSignUpStatusType = Promise<
  FormInitialType<CredsSignUpErrorsType> |
  FormSuccessType |
  FormFailType<CredsSignUpErrorsType>
>

type AuthCardWrapperProps = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel?: string;
  backButtonHref?: string;
};