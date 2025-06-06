import request from "lib/request";

export const SigninApi = async (credentials: {
  email: string;
  password: string;
}) => {
  const { data } = await request.post("/sign-in", credentials);
  return data;
};

export const SignupApi = async (
  credentials: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    password_confirmation: string;
    recapcha: string;
  },
  ref_code: any
) => {
  const finalCredential = {
    ...credentials,
    ref_code: ref_code,
  };

  const { data } = await request.post("/sign-up", finalCredential);
  return data;
};

export const ForgotPasswordApi = async (credentials: { email: string }) => {
  const { data } = await request.post("/forgot-password", credentials);
  return data;
};

export const ResetPasswordApi = async (credentials: {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}) => {
  const { data } = await request.post("/reset-password", credentials);
  return data;
};

export const GetUserInfoByToken = async () => {
  const { data } = await request.get("/profile");
  return data;
};

export const GetUserInfoByTokenServer = async (ctxCookie: string) => {
  const { data } = await request.get("/profile", {
    headers: {
      Authorization: `Bearer ${ctxCookie}`,
    },
  });
  return data;
};

export const UpdateUserInfoByToken = async (Credentials: any) => {
  const { data } = await request.post("/update-profile", Credentials);
  return data;
};

export const SendPhoneVerificationSms = async () => {
  const { data } = await request.post("/send-phone-verification-sms");
  return data;
};

export const PhoneVerify = async (verify_code: number) => {
  const { data } = await request.post("/phone-verify", {
    verify_code,
  });
  return data;
};
export const ChangePassword = async (credentials: {
  old_password: string;
  password: string;
  password_confirmation: string;
}) => {
  const { data } = await request.post("/change-password", credentials);
  return data;
};

export const UploadNid = async (Files: any) => {
  const { data } = await request.post("/upload-nid", Files);
  return data;
};

export const UploadPassport = async (Files: any) => {
  const { data } = await request.post("/upload-passport", Files);
  return data;
};
export const UploadVoter = async (Files: any) => {
  const { data } = await request.post("/upload-voter-card", Files);
  return data;
};

export const UploadDrivingLicence = async (Files: any) => {
  // if(false ){ window.alert( JSON.stringify( Files.entries() ))
  //   window.alert( JSON.stringify(Files ))
  //   window.alert( typeof Files )
  // }
  // console.log ( Object.keys( Files[ 'file_two' ] ) ) 
  // console.log ( JSON.stringify( Files[ 'file_two' ] ) ) 
  for(let [name, value] of Files ) {
    console.log( name, value ); // key1 = value1, then key2 = value2
  }
//  false && window.alert ( '@BEFORE CALL')
  const { data } = await request.post("/upload-driving-licence", Files);
//  window.alert ( '@AFTER  CALL')
  return data;
};

export const KycDetailsApi = async () => {
  const { data } = await request.get("/kyc-details");
  return data;
};
export const UserKycSettingsDetails = async () => {
  const { data } = await request.get("/user-kyc-settings-details");
  return data;
};
export const ThirdPartyKycVerified = async (inquiry_id: string) => {
  const { data } = await request.post("/third-party-kyc-verified", {
    inquiry_id: inquiry_id,
  });
  return data;
};
export const G2fVerifyApi = async (credential: any) => {
  const { data } = await request.post("/g2f-verify", credential);
  return data;
};

export const captchaSettings = async () => {
  const { data } = await request.get("/captcha-settings");
  return data;
};

export const verifyEmailApi = async (credential: any) => {
  const { data } = await request.post("/verify-email", credential);
  return data;
};
export const resendEmailApi = async (email: string) => {
  const { data } = await request.post("/resend-verify-email-code", {
    email: email,
  });
  return data;
};
export const KycActiveList = async () => {
  const { data } = await request.get("/kyc-active-list");
  return data;
};

export const getNetworkListsForCheckDeposit = async () => {
  const { data } = await request.get("/get-networks-list");
  return data;
};

export const getCoinListsForCheckDeposit = async (network_id: any) => {
  const { data } = await request.get(
    `/get-coin-network?network_id=${network_id}`
  );
  return data;
};

export const checkCoinTransactionDepositApi = async (value: any) => {
  const { data } = await request.post("/check-coin-transaction", value);
  return data;
};

export const socialSigninApi = async (credentials: any) => {
  const { data } = await request.post("/social-sign-login", credentials);
  return data;
};
