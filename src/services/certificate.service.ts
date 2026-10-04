import { getToken } from "@/lib/auth";
import { apiFetch } from "@/services/api";
import type { Certificate } from "@/types/certificate";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

export async function getMyCertificates(): Promise<
  Certificate[]
> {
  return apiFetch<Certificate[]>(
    "/api/certificates"
  );
}

export async function getCertificateBySession(
  sessionId: string
): Promise<Certificate> {
  return apiFetch<Certificate>(
    `/api/certificates/session/${sessionId}`
  );
}

export async function issueCertificate(
  sessionId: string
): Promise<Certificate> {
  return apiFetch<Certificate>(
    `/api/certificates/session/${sessionId}`,
    {
      method: "POST",
    }
  );
}

export async function downloadCertificatePdf(
  certificateId: string,
  certificateNumber: string
): Promise<void> {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const response = await fetch(
    `${API_URL}/api/certificates/${certificateId}/pdf`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => null);

    throw new Error(
      error?.message ||
        `Failed to download certificate with status ${response.status}`
    );
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `${certificateNumber}.pdf`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}