export type WaiverSubmission = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  signatureDataUrl: string;
  accepted: boolean;
  signedAt: string;
  /** Dev only — triggers simulated failure when ALLOW_TEST_FAIL is enabled on GCF */
  _testFail?: boolean;
};
