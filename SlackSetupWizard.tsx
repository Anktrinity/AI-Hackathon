import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, ExternalLink, Copy, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface SlackSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SlackSetupWizard({ isOpen, onClose, onSuccess }: SlackSetupWizardProps) {
  const [step, setStep] = useState(1);
  const [slackClientId, setSlackClientId] = useState('');
  const [slackClientSecret, setSlackClientSecret] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [manifestDownloaded, setManifestDownloaded] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const manifestUrl = `${window.location.origin}/api/slack/manifest`;

  const handleDownloadManifest = async () => {
    try {
      const response = await fetch(manifestUrl);
      const manifestData = await response.json();
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'slack-app-manifest.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setManifestDownloaded(true);
      toast({
        title: "Downloaded!",
        description: "Manifest file saved. Now upload it to Slack.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try copying the URL instead",
        variant: "destructive",
      });
    }
  };

  const handleCopyManifest = async () => {
    try {
      await navigator.clipboard.writeText(manifestUrl);
      toast({
        title: "Copied!",
        description: "Manifest URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the URL manually",
        variant: "destructive",
      });
    }
  };

  const handleCopyRedirect = async () => {
    const redirectUrl = `${window.location.origin}/api/slack/oauth/callback`;
    try {
      await navigator.clipboard.writeText(redirectUrl);
      toast({
        title: "Copied!",
        description: "Redirect URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the URL manually",
        variant: "destructive",
      });
    }
  };

  const submitCredentials = useMutation({
    mutationFn: async (credentials: { slackClientId: string; slackClientSecret: string }) => {
      const response = await apiRequest("POST", "/api/slack/setup-credentials", credentials);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Slack Setup Complete!",
        description: "Your Slack app is now configured. You can connect your workspace.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setStep(4);
    },
    onError: (error: any) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to save Slack credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  const testConnection = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/slack/test-connection", {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Connection Test Successful!",
        description: "Your Slack app is properly configured and ready to use.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Test Failed",
        description: error.message || "Please check your Slack app configuration.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async () => {
    if (!slackClientId.trim() || !slackClientSecret.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both Client ID and Client Secret",
        variant: "destructive",
      });
      return;
    }

    submitCredentials.mutate({
      slackClientId: slackClientId.trim(),
      slackClientSecret: slackClientSecret.trim(),
    });
  };

  const handleTestConnection = () => {
    testConnection.mutate();
  };

  const handleFinish = () => {
    onSuccess();
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Connect Slack in 3 Simple Steps</h3>
              <p className="text-muted-foreground">
                We've made this super easy! Just follow along, it takes about 3 minutes.
              </p>
            </div>
            
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <span className="font-medium">Create Slack App (1 min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <span className="font-medium">Get Your App Credentials (1 min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <span className="font-medium">Connect & Done! (1 min)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertDescription>
                <strong>Need help?</strong> We'll guide you through each step with clear instructions.
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <Button onClick={() => setStep(2)} size="lg" data-testid="button-start-setup">
                Start 3-Minute Setup →
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Step 2: Create Your Slack App</h3>
              <span className="text-sm text-muted-foreground">~2 minutes</span>
            </div>
            
            <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>Quick Setup!</strong> We've automated most of this. Just follow these 4 simple clicks.
              </AlertDescription>
            </Alert>

            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">Open Slack API</p>
                    <Button 
                      variant="default" 
                      size="sm" 
                      asChild
                      data-testid="button-open-slack-api"
                      className="mt-2"
                    >
                      <a href="https://api.slack.com/apps?new_app=1" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Slack API (New Tab)
                      </a>
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">Click "From an app manifest"</p>
                    <p className="text-sm text-muted-foreground">On the Slack page, select the second option</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">Choose your workspace & click Next</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">Upload our pre-configured manifest</p>
                    <div className="mt-2 space-y-2">
                      <Button 
                        onClick={handleDownloadManifest}
                        variant="default"
                        size="sm"
                        data-testid="button-download-manifest"
                        className="w-full"
                      >
                        {manifestDownloaded ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Downloaded! Now Upload to Slack
                          </>
                        ) : (
                          <>
                            Download Manifest File
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Then on Slack: Select "JSON" tab → Upload the downloaded file → Click "Next" → Click "Create"
                      </p>
                      
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          💡 Download not working? Click here for alternate method
                        </summary>
                        <div className="mt-2 p-2 bg-muted rounded text-xs space-y-2">
                          <p className="font-medium">Alternative: Copy manifest URL</p>
                          <div className="flex items-center justify-between bg-background p-2 rounded">
                            <code className="text-xs break-all flex-1">{manifestUrl}</code>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={handleCopyManifest}
                              className="ml-2"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <p>Open this URL in your browser, copy the JSON, then paste into Slack's manifest editor.</p>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                ← Back
              </Button>
              <Button onClick={() => setStep(3)} data-testid="button-next-step">
                App Created, Continue →
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Step 3: Get Your App Credentials</h3>
              <span className="text-sm text-muted-foreground">~1 minute</span>
            </div>
            
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <AlertDescription>
                Almost done! Just need to grab your app's credentials from Slack.
              </AlertDescription>
            </Alert>

            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">Go to "Basic Information"</p>
                      <p className="text-sm text-muted-foreground">On your Slack app page, click "Basic Information" in the left sidebar</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start space-x-3">
                    <div className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">Find "App Credentials" section</p>
                      <p className="text-sm text-muted-foreground">Scroll down to see your Client ID and Client Secret</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start space-x-3">
                    <div className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">Copy and paste them below</p>
                      <div className="mt-3 space-y-3">
                        <div>
                          <Label htmlFor="clientId" className="text-sm font-medium">Client ID</Label>
                          <Input
                            id="clientId"
                            value={slackClientId}
                            onChange={(e) => setSlackClientId(e.target.value)}
                            placeholder="1234567890.123456789012"
                            data-testid="input-client-id"
                            className="mt-1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Starts with numbers</p>
                        </div>

                        <div>
                          <Label htmlFor="clientSecret" className="text-sm font-medium">Client Secret</Label>
                          <Input
                            id="clientSecret"
                            type="password"
                            value={slackClientSecret}
                            onChange={(e) => setSlackClientSecret(e.target.value)}
                            placeholder="Click 'Show' on Slack first, then paste here"
                            data-testid="input-client-secret"
                            className="mt-1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Long alphanumeric string (click "Show" on Slack first)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Secure:</strong> Your credentials are encrypted and only you can access your workspace.
              </AlertDescription>
            </Alert>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                ← Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={submitCredentials.isPending || !slackClientId.trim() || !slackClientSecret.trim()}
                data-testid="button-save-credentials"
              >
                {submitCredentials.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save & Continue →'
                )}
              </Button>
            </div>
          </div>
        );


      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Setup Complete! 🎉</h3>
              <p className="text-muted-foreground">
                Your Slack app is now configured and ready to connect to your workspace.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Click "Connect to Slack" to link your workspace</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Use /tasks commands in your Slack channels</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Manage tasks directly from Slack</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-3">
              <Button 
                variant="outline" 
                onClick={handleTestConnection}
                disabled={testConnection.isPending}
                data-testid="button-test-connection"
              >
                {testConnection.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>
              <Button onClick={handleFinish} size="lg" data-testid="button-finish-setup">
                Finish Setup
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="dialog-slack-setup">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Slack Integration Setup</span>
            {step <= 3 && (
              <div className="text-sm text-muted-foreground font-semibold">
                Step {step} of 3
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}