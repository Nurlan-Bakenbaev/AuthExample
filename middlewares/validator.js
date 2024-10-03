import Joi from "joi";

export const signUpValidation = Joi.object({
  email: Joi.string()
    .min(6)
    .max(50)
    .required()
    .email({
      tlds: { allow: ["com", "net", "ru", "kg"] },
    }),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    ),
});
export const signInValidation = Joi.object({
  email: Joi.string()
    .min(6)
    .max(50)
    .required()
    .email({
      tlds: { allow: ["com", "net", "ru", "kg"] },
    }),
  password: Joi.string().required(),
});

export const acceptedCodeValidation = Joi.object({
  email: Joi.string()
    .min(6)
    .max(50)
    .required()
    .email({
      tlds: { allow: ["com", "net", "ru", "kg"] },
    }),
  providedCode: Joi.number().required(),
});
export const changePasswordValidation = Joi.object({
  newPassword: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    ),
  oldPassword: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    ),
});
