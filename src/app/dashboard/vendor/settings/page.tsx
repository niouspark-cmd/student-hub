'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function VendorSettingsPage() {
    const { user } = useUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Placeholder state - in reality we would fetch this via React Query!
    const [shopName, setShopName] = useState("");

    // This function will be properly implemented when we hook up the backend
    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Settings saved!");
            router.push('/dashboard/vendor');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Shop Settings</h1>
                    <p className="text-foreground/60">Manage your store identity and preferences</p>
                </div>
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>

            <Card className="bg-surface border-surface-border">
                <CardHeader>
                    <CardTitle>Global Identity</CardTitle>
                    <CardDescription>This is how students see your shop on the marketplace</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2 block">Shop Name</label>
                        <input
                            type="text"
                            className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 font-bold"
                            placeholder={user?.firstName ? `${user.firstName}'s Shop` : "My Shop"}
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2 block">Contact Phone (Mobile Money)</label>
                        <input
                            type="tel"
                            className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 font-bold"
                            placeholder="054XXXXXXX"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-surface border-surface-border">
                <CardHeader>
                    <CardTitle>Delivery & Operations</CardTitle>
                    <CardDescription>Configure how you fulfill orders</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border border-surface-border rounded-xl bg-background">
                        <div>
                            <h3 className="font-bold">Accepting Orders</h3>
                            <p className="text-sm text-foreground/60">Turn this off if you are closed or busy</p>
                        </div>
                        <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button onClick={handleSave} className="bg-primary text-black font-bold h-12 px-8">
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}
