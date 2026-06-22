"use client";

export default function ClientPage({ role }: any) {
  return (
    <div>
      <h1>Interview शुरू: {role?.name}</h1>
    </div>
  );
}
