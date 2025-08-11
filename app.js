// ---------------------------
// Provinces → Districts (only Punjab districts kept for filtering)
// ---------------------------
const provincesData = {
  "Punjab": [
    "Lahore", "Multan", "Faisalabad", "Rawalpindi", "Sialkot",
    "Gujranwala", "Bahawalpur", "Sargodha", "Sahiwal",
    "Sheikhupura", "Jhelum", "Okara", "Dera Ghazi Khan"
  ]
};

// ---------------------------
// Roles and Status options
// ---------------------------
const roles = ["Veterinary Officer", "Veterinary Assistant", "Field Staff", "AIT"];
const statuses = ["moving", "static", "non-performer"];

// ---------------------------
// Random coordinate generator helper
// ---------------------------
function randomCoord(baseLat, baseLng) {
  return [
    baseLat + (Math.random() - 0.5) * 0.1,
    baseLng + (Math.random() - 0.5) * 0.1
  ];
}

// Base coordinates for districts (Punjab only)
const districtCoords = {
  "Lahore": [31.5204, 74.3587],
  "Multan": [30.1575, 71.5249],
  "Faisalabad": [31.4504, 73.1350],
  "Rawalpindi": [33.5651, 73.0169],
  "Sialkot": [32.4945, 74.5229],
  "Gujranwala": [32.1877, 74.1945],
  "Bahawalpur": [29.3956, 71.6836],
  "Sargodha": [32.0837, 72.6711],
  "Sahiwal": [30.6713, 73.1168],
  "Sheikhupura": [31.7131, 73.9783],
  "Jhelum": [32.9337, 73.7266],
  "Okara": [30.8081, 73.4458],
  "Dera Ghazi Khan": [30.0532, 70.6354]
};

let employees = [];
let idCounter = 1;

// Define only one geofence for UC Gulberg (Lahore)
const geofences = {
  "Gulberg": L.circle([31.5497, 74.3514], {
    radius: 1500,
    color: 'red',
    fillColor: '#FF0000',
    fillOpacity: 0.2
  })
};

// Map union councils to geofence names
const unionCouncils = {
  "Gulberg": "UC Zaman Park"
};

// Generate sample employees only for Punjab districts with 10–15 employees per district
provincesData["Punjab"].forEach(district => {
  const [baseLat, baseLng] = districtCoords[district];
  const numEmployees = Math.floor(Math.random() * 6) + 10; // 10–15 employees per district

  for (let i = 0; i < numEmployees; i++) {
    let lat, lng;
    if (district === "Lahore" && idCounter === 1) {
      // Fixed employee E001 inside Gulberg geofence, must be static or non-performer
      lat = 31.5497 + (Math.random() - 0.5) * 0.002; // small jitter inside geofence
      lng = 74.3514 + (Math.random() - 0.5) * 0.002;
    } else {
      [lat, lng] = randomCoord(baseLat, baseLng);
    }

    // Pick role randomly
    const role = roles[Math.floor(Math.random() * roles.length)];
    // For E001, force status to be static or non-performer, else random
    let status;
    if (district === "Lahore" && idCounter === 1) {
      status = ["static", "non-performer"][Math.floor(Math.random() * 2)];
    } else {
      status = statuses[Math.floor(Math.random() * statuses.length)];
    }

    const emp = {
      id: `E${String(idCounter).padStart(3, "0")}`,
      name: `Emp ${idCounter}`,
      role,
      status,
      province: "Punjab",
      district,
      facility: `${district}-Disp-${String(i + 1).padStart(2, "0")}`,
      lat,
      lng,
      last_seen: "2025-08-11 " + String(8 + Math.floor(Math.random() * 10)).padStart(2, "0") + ":" + String(Math.floor(Math.random() * 60)).padStart(2, "0"),
      visits_today: Math.floor(Math.random() * 5),
      perf_score: Math.floor(Math.random() * 100),
    };

    if (status === "moving") {
      emp.track = [
        { lat: lat + 0.01, lng: lng + 0.01 },
        { lat: lat + 0.015, lng: lng + 0.015 },
        { lat: lat + 0.02, lng: lng + 0.02 }
      ];
    }

    employees.push(emp);
    idCounter++;
  }
});

// ---------------------------
// Map and Marker setup
// ---------------------------
let map;
let markers = [];
let currentPolyline = null;

// Initial map center and zoom for reset
const INITIAL_MAP_CENTER = [31.5, 74.35];
const INITIAL_MAP_ZOOM = 12;

const ICONS = {
  moving: L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  }),
  static: L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  }),
  "non-performer": L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  }),
  geofence: L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  })
};

document.addEventListener("DOMContentLoaded", () => {
  map = L.map('map').setView(INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add only Gulberg geofence circle to the map
  geofences["Gulberg"].addTo(map);

  renderMarkers(employees);

  document.getElementById("districtSelect").addEventListener("change", applyFilters);
  document.getElementById("roleSelect").addEventListener("change", applyFilters);
  document.getElementById("statusSelect").addEventListener("change", applyFilters);
  document.getElementById("applyBtn").addEventListener("click", applyFilters);
  document.getElementById("resetBtn").addEventListener("click", () => {
    resetFilters();
    map.setView(INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM);
  });
  document.getElementById("searchInput").addEventListener("input", applyFilters);
});

// Helper: check if point is inside circle geofence
function isInsideGeofence(lat, lng, geofenceCircle) {
  const point = L.latLng(lat, lng);
  return point.distanceTo(geofenceCircle.getLatLng()) <= geofenceCircle.getRadius();
}

// Clear all markers from map
function clearMarkers() {
  markers.forEach(m => m.remove());
  markers = [];
}

// Clear any polyline from map
function clearPolyline() {
  if (currentPolyline) {
    currentPolyline.remove();
    currentPolyline = null;
  }
}

// Render markers and employee list
function renderMarkers(data) {
  clearMarkers();
  updateEmployeeList(data);

  data.forEach(emp => {
    // Default icon by status
    let icon = ICONS[emp.status];

    // Override icon only for the fixed employee inside Gulberg geofence
    let ucName = null;
    if (
      emp.id === "E001" &&
      (emp.status === "static" || emp.status === "non-performer") &&
      isInsideGeofence(emp.lat, emp.lng, geofences["Gulberg"])
    ) {
      icon = ICONS.geofence; // orange pin for Gulberg fenced employee
      ucName = unionCouncils["Gulberg"];
    }

    const marker = L.marker([emp.lat, emp.lng], { icon }).addTo(map);
    marker.on("click", () => onMarkerClick(emp, marker, ucName));
    markers.push(marker);
  });
}

// Marker click shows popup and movement path if any
// Added ucName param and show in popup if present
function onMarkerClick(emp, marker, ucName) {
  clearPolyline();

  let popupHtml = `
    <div style="min-width:200px">
      <strong>${emp.name}</strong> (${emp.id})<br/>
      Role: ${emp.role}<br/>
      Facility: ${emp.facility}<br/>
      District: ${emp.district}<br/>
      Province: ${emp.province}<br/>
      Last seen: ${emp.last_seen}<br/>
      Visits today: ${emp.visits_today}<br/>
      Performance: ${emp.perf_score}%<br/>
  `;

  if (ucName) {
    popupHtml += `<strong>Fenced Union Council:</strong> ${ucName}<br/>`;
    popupHtml += `<em>This employee is restricted to work only within this geofenced area.</em><br/>`;
  }

  popupHtml += `</div>`;

  if (emp.status === "moving" && emp.track) {
    let path = emp.track.map(p => [p.lat, p.lng]);
    currentPolyline = L.polyline(path, { color: "green", weight: 4 }).addTo(map);

    let distance = 0;
    for (let i = 1; i < path.length; i++) {
      distance += L.latLng(path[i - 1]).distanceTo(L.latLng(path[i]));
    }
    let km = (distance / 1000).toFixed(2);
    popupHtml += `<br/><strong>Distance covered:</strong> ${km} km`;

    map.fitBounds(currentPolyline.getBounds());
  }

  marker.bindPopup(popupHtml).openPopup();
}

// Filtering logic
function applyFilters() {
  const province = document.getElementById("provinceSelect").value; // Always Punjab
  const district = document.getElementById("districtSelect").value;
  const selectedRole = document.getElementById("roleSelect").value;
  const selectedStatus = document.getElementById("statusSelect").value;
  const search = document.getElementById("searchInput")?.value?.toLowerCase() || "";

  const filtered = employees.filter(emp => {
    if (province !== "All" && emp.province !== province) return false;
    if (district !== "All" && emp.district !== district) return false;
    if (selectedRole !== "All" && emp.role !== selectedRole) return false;
    if (selectedStatus !== "All" && emp.status !== selectedStatus) return false;
    if (search && !(`${emp.name} ${emp.id}`.toLowerCase().includes(search))) return false;
    return true;
  });

  renderMarkers(filtered);

  if (filtered.length > 0) {
    const bounds = L.latLngBounds(filtered.map(emp => [emp.lat, emp.lng]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }
}

// Reset filters to defaults
function resetFilters() {
  document.getElementById("provinceSelect").value = "Punjab";
  const districtSelect = document.getElementById("districtSelect");
  districtSelect.value = "All";
  districtSelect.disabled = false;
  document.getElementById("roleSelect").value = "All";
  document.getElementById("statusSelect").value = "All";
  document.getElementById("searchInput").value = "";

  renderMarkers(employees);
}

// Update the employee list panel
function updateEmployeeList(data) {
  const container = document.getElementById("employeeList");
  container.innerHTML = "";

  data.forEach(emp => {
    const row = document.createElement("div");
    row.className = "employee-row";
    row.innerHTML = `
      <div class="pin" style="background:${
        emp.status === "moving" ? "#28a745" : emp.status === "static" ? "#0d6efd" : "#dc3545"
      }"></div>
      <div class="meta">
        <div class="name">${emp.name} <small>(${emp.id})</small></div>
        <div class="sub">${emp.role} • ${emp.facility}</div>
      </div>
    `;
    row.addEventListener("click", () => {
      map.setView([emp.lat, emp.lng], 12);
    });
    container.appendChild(row);
  });
}
