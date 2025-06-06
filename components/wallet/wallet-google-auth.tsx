import useTranslation from "next-translate/useTranslation";
import React from "react";

const WalletGoogleAuth = ({
  handleSubmit,
  withdrawalCredentials,
  setWithdrawalCredentials,
  processing,
}: any) => {
  const { t } = useTranslation("common");
  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("Google Authentication")}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-12">
                <p>
                  {t(
                    "Open your Google Authenticator app and enter the 6-digit code from the app into the input field  "
                  )}
                </p>
                <input
                  placeholder={t("Code")}
                  required
                  type="text"
                  className="form-control"
                  name="code"
                  value={withdrawalCredentials.code}
                  onChange={(e) => {
                    setWithdrawalCredentials({
                      ...withdrawalCredentials,
                      code: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {!processing && (
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                {t("Close")}
              </button>
            )}

            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={processing}
              data-dismiss="modal"
            >
              {processing ? (
                <>
                  <span
                    className="spinner-border spinner-border-md"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span>{t("Please wait")}</span>
                </>
              ) : (
                t("Verify")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletGoogleAuth;
