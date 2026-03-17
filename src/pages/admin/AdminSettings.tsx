import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Building2, Shield, Key, Webhook, Plus, Copy, Eye, EyeOff, Trash2, RefreshCw,
} from "lucide-react";
import { useState } from "react";

const mockApiKeys = [
  { id: "k1", name: "Production Key", prefix: "arena_live_", last4: "x9f2", created: "2025-01-15", lastUsed: "2 min ago" },
  { id: "k2", name: "Development Key", prefix: "arena_test_", last4: "m3k8", created: "2025-02-20", lastUsed: "3 hrs ago" },
];

const mockWebhooks = [
  { id: "w1", url: "https://hooks.acme.com/arena/events", events: ["session.completed", "user.enrolled"], status: "active", lastTriggered: "12 min ago" },
  { id: "w2", url: "https://api.internal.io/webhooks/arena", events: ["program.updated"], status: "active", lastTriggered: "2 days ago" },
];

export default function AdminSettings() {
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [enforceSso, setEnforceSso] = useState(false);

  return (
    <AdminLayout pageTitle="Settings">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

          <Tabs defaultValue="general" className="space-y-5">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="general" className="text-xs gap-1.5"><Building2 className="h-3.5 w-3.5" /> General</TabsTrigger>
              <TabsTrigger value="sso" className="text-xs gap-1.5"><Shield className="h-3.5 w-3.5" /> SSO</TabsTrigger>
              <TabsTrigger value="api" className="text-xs gap-1.5"><Key className="h-3.5 w-3.5" /> API Keys</TabsTrigger>
              <TabsTrigger value="webhooks" className="text-xs gap-1.5"><Webhook className="h-3.5 w-3.5" /> Webhooks</TabsTrigger>
            </TabsList>

            {/* ── General / Branding ── */}
            <TabsContent value="general" className="space-y-5">
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Organization</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Organization Name</label>
                    <Input defaultValue="Arena Learning Inc." className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Support Email</label>
                    <Input defaultValue="support@arena.io" className="h-9 text-sm" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Branding</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Logo</label>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">Logo</div>
                      <Button size="sm" variant="outline">Upload</Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-lg bg-primary border border-border" />
                      <Input defaultValue="#4D9E94" className="h-9 text-sm flex-1" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Custom Domain</label>
                  <Input defaultValue="learn.acmecorp.com" className="h-9 text-sm max-w-sm" />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Defaults</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Default Session Duration</label>
                    <Input defaultValue="20 min" className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Default Target Level</label>
                    <Input defaultValue="4.0" className="h-9 text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button size="sm">Save Changes</Button>
              </div>
            </TabsContent>

            {/* ── SSO ── */}
            <TabsContent value="sso" className="space-y-5">
              <div className="rounded-xl border border-border bg-card p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-card-foreground">Single Sign-On (SSO)</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Allow users to log in with your identity provider</p>
                  </div>
                  <Switch checked={ssoEnabled} onCheckedChange={setSsoEnabled} />
                </div>

                {ssoEnabled && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 border-t border-border pt-4">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Identity Provider</label>
                      <Input defaultValue="Okta" className="h-9 text-sm max-w-xs" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">SSO URL (SAML Endpoint)</label>
                      <Input placeholder="https://your-idp.com/sso/saml" className="h-9 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Certificate (X.509)</label>
                      <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground font-mono min-h-[80px] resize-none" placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----" />
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                      <div>
                        <p className="text-xs font-medium text-card-foreground">Enforce SSO for all users</p>
                        <p className="text-[10px] text-muted-foreground">Disables email/password login</p>
                      </div>
                      <Switch checked={enforceSso} onCheckedChange={setEnforceSso} />
                    </div>
                  </motion.div>
                )}
              </div>
            </TabsContent>

            {/* ── API Keys ── */}
            <TabsContent value="api" className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{mockApiKeys.length} API keys</p>
                <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Create Key</Button>
              </div>
              {mockApiKeys.map((key) => (
                <div key={key.id} className="rounded-xl border border-border bg-card p-4 group">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-card-foreground">{key.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono text-muted-foreground">
                          {key.prefix}••••••••{key.last4}
                        </code>
                        <button className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                        <span>Created {key.created}</span>
                        <span>Last used {key.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors"><RefreshCw className="h-3.5 w-3.5" /></button>
                      <button className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* ── Webhooks ── */}
            <TabsContent value="webhooks" className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{mockWebhooks.length} webhooks</p>
                <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Add Webhook</Button>
              </div>
              {mockWebhooks.map((wh) => (
                <div key={wh.id} className="rounded-xl border border-border bg-card p-4 group">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-card-foreground font-mono">{wh.url}</code>
                        <Badge variant="default" className="text-[9px] uppercase tracking-wider">{wh.status}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {wh.events.map((e) => (
                          <span key={e} className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">{e}</span>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-2">Last triggered {wh.lastTriggered}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>

        </motion.div>
      </div>
    </AdminLayout>
  );
}
