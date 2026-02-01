import { useState } from "react";
import { Copy, Info, Key, MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

export default function WorkflowSettings() {
    const [apiKey] = useState("sk_live_51M0d8sL9s8d7f6g5h4j3k2l1...XyZ");

    const [notifications, setNotifications] = useState({
        failures: true,
        success: false,
        digest: true
    });

    const webhooks = [
        { url: "https://api.myapp.com/events", events: ["push", "pr.merge"], status: "active" },
        { url: "https://staging.myapp.com/test", events: ["issue.created"], status: "failed" },
        { url: "https://integrations.legacy.com/v1", events: ["all events"], status: "disabled" },
    ];

    return (
        <div className="max-w-4xl mx-auto px-8 py-10">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <span className="hover:text-slate-800 hover:underline cursor-pointer">Settings</span>
                <span className="text-slate-300">/</span>
                <span className="hover:text-slate-800 hover:underline cursor-pointer">Workflow</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-medium">Configuration</span>
            </div>

            {/* Page Header */}
            <div className="flex justify-between items-end border-b border-slate-200 pb-6 mb-10">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Workflow Settings</h2>
                    <p className="text-slate-500 mt-2 text-base">Manage your API keys, webhooks, and event subscriptions.</p>
                </div>
                <Button size="default">Save Changes</Button>
            </div>

            {/* API Configuration Section */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">API Keys</h3>
                    <a href="#" className="text-sm text-primary hover:text-primary-hover font-medium">View Documentation</a>
                </div>
                <div className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden">
                    <div className="p-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Production Secret Key</label>
                        <div className="flex gap-0 relative">
                            <div className="relative flex-grow flex items-center">
                                <Key className="absolute left-3 text-slate-400 h-5 w-5" />
                                <Input
                                    readOnly
                                    value={apiKey}
                                    className="pl-10 pr-12 py-2.5 font-mono text-slate-600 bg-slate-50 border-r-0 rounded-r-none focus-visible:ring-0 focus-visible:border-primary"
                                />
                            </div>
                            <Button
                                variant="outline"
                                className="rounded-l-none border-l-0 bg-white hover:bg-slate-50 text-slate-700 h-[38px]" /* Adjust height to match input + borders */
                                title="Copy to clipboard"
                            >
                                <Copy className="h-5 w-5 text-slate-400" />
                            </Button>
                        </div>
                        <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                            <Info className="h-3.5 w-3.5" />
                            Your secret key grants full access to your account. Keep it safe.
                        </p>
                    </div>
                    <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-mono">Last used: 2 minutes ago</span>
                        <button className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline">Revoke Key</button>
                    </div>
                </div>
            </section>

            {/* Webhooks Section */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Webhooks</h3>
                    <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50 text-slate-700">
                        <Plus className="h-4 w-4 mr-1.5" />
                        Add Endpoint
                    </Button>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Endpoint URL</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Events</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {webhooks.map((webhook, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className={cn("text-sm font-medium font-mono", webhook.status === 'disabled' ? 'text-slate-400' : 'text-slate-900')}>
                                                {webhook.url}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            {webhook.events.map(event => (
                                                <span key={event} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                                    {event}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                            webhook.status === 'active' && "bg-green-50 text-green-700 border-green-100",
                                            webhook.status === 'failed' && "bg-red-50 text-red-700 border-red-100",
                                            webhook.status === 'disabled' && "bg-slate-100 text-slate-600 border-slate-200"
                                        )}>
                                            <span className={cn(
                                                "size-1.5 rounded-full",
                                                webhook.status === 'active' && "bg-green-600",
                                                webhook.status === 'failed' && "bg-red-600",
                                                webhook.status === 'disabled' && "bg-slate-400"
                                            )}></span>
                                            {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Notifications Section */}
            <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <div className="flex-1 pr-4">
                            <h4 className="text-sm font-medium text-slate-900">Workflow Failures</h4>
                            <p className="text-xs text-slate-500 mt-1">Receive an email immediately when a critical workflow fails.</p>
                        </div>
                        <Toggle
                            checked={notifications.failures}
                            onCheckedChange={(c) => setNotifications({ ...notifications, failures: c })}
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <div className="flex-1 pr-4">
                            <h4 className="text-sm font-medium text-slate-900">Deployment Success</h4>
                            <p className="text-xs text-slate-500 mt-1">Get notified when a deployment to production completes successfully.</p>
                        </div>
                        <Toggle
                            checked={notifications.success}
                            onCheckedChange={(c) => setNotifications({ ...notifications, success: c })}
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <div className="flex-1 pr-4">
                            <h4 className="text-sm font-medium text-slate-900">Weekly Digest</h4>
                            <p className="text-xs text-slate-500 mt-1">A summary of your team's activity sent every Monday.</p>
                        </div>
                        <Toggle
                            checked={notifications.digest}
                            onCheckedChange={(c) => setNotifications({ ...notifications, digest: c })}
                        />
                    </div>
                </div>
            </section>

            {/* Spacer */}
            <div className="h-20"></div>
        </div>
    );
}
