"use client";

import PrivateComponent from "../routes/private";

export default function Profile() {
  return (
    <PrivateComponent>
      <div className="flex w-full h-[calc(100vh-96px)]">Profile Page</div>
    </PrivateComponent>
  );
}
