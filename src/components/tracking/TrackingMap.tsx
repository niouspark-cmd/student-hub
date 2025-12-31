'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Locate, Phone, MessageCircle, Map as MapIcon, Layers } from 'lucide-react';

// Fix Leaflet Default Icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Runner Icon (Rotatable)
const createRunnerIcon = (rotation: number) => L.divIcon({
    className: 'runner-marker-icon',
    html: `<div style="transform: rotate(${rotation}deg); transition: transform 0.5s ease;">
        <div style="background-color: white; border-radius: 50%; padding: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid #3b82f6;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 19h-6.38a1.99 1.99 0 0 1-1.89-1.37L5 4h18a2 2 0 0 1 2 2v13z"></path>
                <circle cx="9" cy="19" r="2"></circle>
                <circle cx="19" cy="19" r="2"></circle>
            </svg>
        </div>
    </div>`,
    iconSize: [40, 40], // Size of the icon
    iconAnchor: [20, 20], // Point of the icon which will correspond to marker's location
});

// Component to handle map view updates
function MapUpdater({ center, zoom }: { center: [number, number], zoom?: number }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom || map.getZoom(), { duration: 1.5 }); // Smooth flyTo
        }
    }, [center, zoom, map]);
    return null;
}

interface TrackingMapProps {
    orderId: string;
    studentLocation: [number, number]; // [lat, lng]
    vendorLocation: [number, number]; // [lat, lng]
    runnerLocation: [number, number] | null; // [lat, lng]
    runnerHeading: number; // degrees
    orderStatus: string; // PREPARING, PICKED_UP, etc.
}

export default function TrackingMap({
    orderId,
    studentLocation = [5.6037, -0.1870], // Default Acc
    vendorLocation = [5.6037, -0.1870], // Default
    runnerLocation,
    runnerHeading = 0,
    orderStatus
}: TrackingMapProps) {
    const [mapLayer, setMapLayer] = useState<'standard' | 'satellite'>('standard');

    // Derived bounds to fit everything
    const bounds = useMemo(() => {
        const points = [studentLocation, vendorLocation];
        if (runnerLocation) points.push(runnerLocation);
        return L.latLngBounds(points);
    }, [studentLocation, vendorLocation, runnerLocation]);

    // Layers
    const layers = {
        standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    };

    const attribution = {
        standard: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    };

    return (
        <div className="relative w-full h-[70vh] z-0">
            <MapContainer
                center={studentLocation}
                zoom={15}
                className="w-full h-full"
                zoomControl={false}
                scrollWheelZoom={true} // Allow scroll on mobile usually
            >
                <TileLayer
                    attribution={attribution[mapLayer]}
                    url={layers[mapLayer]}
                />

                {/* Student Location (Pulse) */}
                <CircleMarker center={studentLocation} radius={8} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.8 }}>
                    <Popup>You (Waiting)</Popup>
                </CircleMarker>
                {/* Pulse Effect Ring */}
                <CircleMarker center={studentLocation} radius={16} pathOptions={{ color: '#3b82f6', weight: 1, fill: false, opacity: 0.4 }} />

                {/* Vendor Location */}
                <Marker position={vendorLocation}>
                    <Popup>Vendor</Popup>
                </Marker>

                {/* Runner Location */}
                {runnerLocation && (
                    <>
                        <Marker
                            position={runnerLocation}
                            icon={createRunnerIcon(runnerHeading)}
                        />
                        <MapUpdater center={runnerLocation} />
                    </>
                )}

                {/* Path Line */}
                {runnerLocation && (
                    <Polyline
                        positions={[runnerLocation, studentLocation]}
                        pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.6, dashArray: '10, 10' }}
                    />
                )}
            </MapContainer>

            {/* Layer Toggle FAB */}
            <button
                onClick={() => setMapLayer(prev => prev === 'standard' ? 'satellite' : 'standard')}
                className="absolute top-4 right-4 z-[400] bg-white p-3 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all text-gray-700"
            >
                {mapLayer === 'standard' ? <Layers size={20} /> : <MapIcon size={20} />}
            </button>

            {/* Recenter FAB */}
            {runnerLocation && (
                <button
                    onClick={() => {/* Trigger recenter via state or context if needed, but the MapUpdater handles updates. Maybe force center on user? */ }}
                    className="absolute bottom-6 right-4 z-[400] bg-white p-3 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all text-blue-600"
                >
                    <Locate size={20} />
                </button>
            )}
        </div>
    );
}
