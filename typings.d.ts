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

type ProcedureSuccessType<DataType> = {
  status: "SUCCESS";
  message: string;
  data?: Partial<DataType>;
};

type ProcedureFailType<ErrorsType> = {
  status: "FAILED";
  errors?: Partial<ErrorsType>;
  message: string;
};

type ProcedureStatus<ProcedureType> = Promise<
  ProcedureSuccessType<ProcedureType> |
  ProcedureFailType<ProcedureType>
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
