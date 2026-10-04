"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  downloadCertificatePdf,
  getMyCertificates,
} from "@/services/certificate.service";
import type { Certificate } from "@/types/certificate";

export default function CertificatesView() {
  const [certificates, setCertificates] = useState<
    Certificate[]
  >([]);
  const [downloadingId, setDownloadingId] =
  useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCertificates() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyCertificates();

        setCertificates(data);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load certificates."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCertificates();
  }, []);

  async function handleDownload(
    certificate: Certificate
  ) {
    try {
      setDownloadingId(certificate.id);

      await downloadCertificatePdf(
        certificate.id,
        certificate.certificateNumber
      );
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
            ? err.message
            : "Failed to download certificate."
        );
    } finally {
        setDownloadingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading certificates...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <h2 className="font-bold text-red-700">
          Unable to load certificates
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-[#006CB8]">
          Training Achievement
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Certificates
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View certificates earned from successfully
          completed fleet safety training.
        </p>
      </div>

      {certificates.length === 0 ? (
        <EmptyCertificates />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {certificates.map((certificate) => (
            <CertificateCard
                key={certificate.id}
                certificate={certificate}
                downloading={
                    downloadingId === certificate.id
                }
                onDownload={() =>
                    handleDownload(certificate)
                }
                />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyCertificates() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="text-4xl">🏆</div>

      <h2 className="mt-4 text-lg font-bold text-slate-900">
        No Certificates Yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Certificates are awarded after you successfully
        pass a fleet safety training session.
      </p>

      <Link
        href="/history"
        className="mt-5 inline-flex rounded-xl bg-[#006CB8] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        View Training History →
      </Link>
    </div>
  );
}

function CertificateCard({
  certificate,
  downloading,
  onDownload,
}: {
  certificate: Certificate;
  downloading: boolean;
  onDownload: () => void;
}) {
  const issuedDate = new Date(
    certificate.issuedAt
  ).toLocaleDateString();

  return (
    <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      <div className="border-b border-blue-100 bg-blue-50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#006CB8]">
              Certificate of Completion
            </p>

            <h2 className="mt-2 text-lg font-bold text-slate-900">
              {certificate.learningModuleName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {certificate.scenarioName}
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
            🏆
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <CertificateInfo
            label="Participant"
            value={certificate.participantName}
          />

          <CertificateInfo
            label="Overall Score"
            value={`${formatScore(
              certificate.overallScore
            )}/100`}
          />

          <CertificateInfo
            label="Certificate No."
            value={certificate.certificateNumber}
          />

          <CertificateInfo
            label="Issued"
            value={issuedDate}
          />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            {certificate.result}
          </span>


          <div className="flex flex-wrap items-center gap-3">
            <Link
                href={`/performance?sessionId=${encodeURIComponent(
                certificate.simulationSessionId
                )}`}
                className="text-sm font-semibold text-[#006CB8]"
            >
                View Performance
            </Link>

            <button
                type="button"
                onClick={onDownload}
                disabled={downloading}
                className="rounded-xl bg-[#006CB8] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {downloading
                ? "Downloading..."
                : "Download PDF ↓"}
            </button>
            </div>
        </div>
      </div>
    </section>
  );
}

function CertificateInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function formatScore(value: number) {
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}