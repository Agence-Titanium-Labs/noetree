"use client";
import { useStoreUserEffect } from "@/hooks/useStoreUserEffect";
import ConditionChecker from "@/components/helpers/ConditionChecker";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Header() {
  const { isLoading, isAuthenticated } = useStoreUserEffect();
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <ConditionChecker condition={!isLoading}>
        <ConditionChecker condition={isAuthenticated}>
          <UserButton />
        </ConditionChecker>
        <ConditionChecker condition={!isAuthenticated}>
          <SignInButton />
          <SignUpButton />
        </ConditionChecker>
      </ConditionChecker>
    </header>
  );
}
