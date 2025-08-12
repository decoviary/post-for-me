import { useState } from "react";
import { Form, useNavigate } from "react-router";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/ui/dialog";

import { ProviderGrid } from "./_provider-grid";
import { SocialAuthForm } from "./_social-auth-form";
import {
  getProviderConfig,
  getProvidersRequiringAuth,
} from "./_provider-configs";

export function Component() {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  function goBack() {
    navigate(-1);
  }

  function handleProviderSelect(providerId: string) {
    const providersRequiringAuth = getProvidersRequiringAuth();

    if (providersRequiringAuth.includes(providerId)) {
      setSelectedProvider(providerId);
    }
    // If provider doesn't require custom auth, let the form submit normally
  }

  function handleAuthFormClose() {
    setSelectedProvider(null);
  }

  const providerConfig = selectedProvider
    ? getProviderConfig(selectedProvider)
    : null;

  return (
    <>
      <Dialog open={!selectedProvider} onOpenChange={goBack}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Social Account</DialogTitle>
            <DialogDescription>
              Choose a social media platform to connect to your project.
            </DialogDescription>
          </DialogHeader>

          <Form method="post">
            <ProviderGrid onProviderSelect={handleProviderSelect} />
          </Form>
        </DialogContent>
      </Dialog>

      <SocialAuthForm
        provider={providerConfig}
        open={!!selectedProvider}
        onClose={handleAuthFormClose}
        onBack={handleAuthFormClose}
      />
    </>
  );
}
