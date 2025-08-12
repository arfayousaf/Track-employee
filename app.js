// ---------------------------
// Provinces → Districts (Punjab only)
// ---------------------------
const provincesData = {
  "Punjab": [
    "Lahore", "Multan", "Faisalabad", "Rawalpindi", "Sialkot",
    "Gujranwala", "Bahawalpur", "Sargodha", "Sahiwal",
    "Sheikhupura", "Jhelum", "Okara", "Dera Ghazi Khan"
  ]
};

const roles = ["Veterinary Officer", "Veterinary Assistant", "Field Staff", "AIT"];
const statuses = ["moving", "static", "non-performer"];

// Base coords for districts
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

// Helper: generate slight jitter coords near a base point
function randomCoord(baseLat, baseLng, maxOffset = 0.01) {
  return [
    baseLat + (Math.random() - 0.5) * maxOffset,
    baseLng + (Math.random() - 0.5) * maxOffset
  ];
}

// ---------------------------
// Define realistic polygon geofences per district
// Each polygon is an array of lat,lng pairs
// (Note: Coordinates are illustrative, small offset from district center)
// ---------------------------
const geofencePolygons = {
  
"Lahore": [
    {
      name: "UC Model Town",
      coords: [
        [31.496, 74.334], [31.502, 74.346], [31.499, 74.353], [31.491, 74.354], [31.485, 74.343]
      ],
      color: 'blue',
    },
    {
      name: "UC Garden Town",
      coords: [
        [31.517, 74.352], [31.523, 74.364], [31.519, 74.370], [31.510, 74.365], [31.507, 74.357]
      ],
      color: 'red',
    },
    {
      name: "UC Gulberg",
      coords: [
        [31.536, 74.347], [31.542, 74.358], [31.538, 74.363], [31.531, 74.362], [31.528, 74.355]
      ],
      color: 'blue',
    },
    {
      name: "UC Shadman",
      coords: [
        [31.540, 74.328], [31.547, 74.337], [31.544, 74.345], [31.536, 74.341], [31.532, 74.333]
      ],
      color: 'red',
    },
    {
      name: "UC Iqbal Town",
      coords: [
        [31.475, 74.355], [31.481, 74.364], [31.478, 74.372], [31.469, 74.370], [31.465, 74.360]
      ],
      color: 'blue',
    }
  ],
  "Multan": [
    {
      name: "UC Bosan",
      coords: [
        [30.182, 71.455], [30.190, 71.462], [30.187, 71.470], [30.178, 71.468], [30.175, 71.460]
      ],
      color: 'red',
    },
    {
      name: "UC Shah Rukn-e-Alam",
      coords: [
        [30.163, 71.500], [30.170, 71.507], [30.166, 71.514], [30.159, 71.511], [30.156, 71.503]
      ],
      color: 'blue',
    },
    {
      name: "UC Town Committee",
      coords: [
        [30.152, 71.475], [30.158, 71.483], [30.154, 71.490], [30.148, 71.487], [30.145, 71.480]
      ],
      color: 'red',
    },
    {
      name: "UC Shalimar",
      coords: [
        [30.177, 71.490], [30.183, 71.498], [30.179, 71.505], [30.173, 71.502], [30.170, 71.495]
      ],
      color: 'blue',
    }
  ],
  "Faisalabad": [
    {
      name: "UC Jaranwala",
      coords: [
        [31.370, 73.000], [31.375, 73.010], [31.380, 73.008], [31.378, 72.998], [31.372, 72.995]
      ],
      color: 'blue',
    },
    {
      name: "UC Samanabad",
      coords: [
        [31.455, 73.120], [31.460, 73.130], [31.465, 73.125], [31.462, 73.115], [31.457, 73.110]
      ],
      color: 'red',
    },
    {
      name: "UC Millat Town",
      coords: [
        [31.440, 73.145], [31.445, 73.155], [31.448, 73.150], [31.443, 73.140], [31.438, 73.135]
      ],
      color: 'blue',
    }
  ],

  "Gujranwala": [
    {
      name: "UC Wazirabad",
      coords: [
        [32.260, 74.140], [32.265, 74.150], [32.270, 74.145], [32.268, 74.135], [32.263, 74.130]
      ],
      color: 'red',
    },
    {
      name: "UC Kamoke",
      coords: [
        [32.210, 74.200], [32.215, 74.210], [32.220, 74.205], [32.218, 74.195], [32.213, 74.190]
      ],
      color: 'blue',
    },
    {
      name: "UC Gujranwala City",
      coords: [
        [32.180, 74.190], [32.185, 74.200], [32.190, 74.195], [32.188, 74.185], [32.183, 74.180]
      ],
      color: 'red',
    }
  ],

  "Rawalpindi": [
    {
      name: "UC Saddar",
      coords: [
        [33.600, 73.050], [33.605, 73.060], [33.610, 73.055], [33.608, 73.045], [33.603, 73.040]
      ],
      color: 'blue',
    },
    {
      name: "UC Bahria Town",
      coords: [
        [33.570, 72.990], [33.575, 73.000], [33.580, 72.995], [33.578, 72.985], [33.573, 72.980]
      ],
      color: 'red',
    },
    {
      name: "UC Rawal Town",
      coords: [
        [33.580, 73.020], [33.585, 73.030], [33.590, 73.025], [33.588, 73.015], [33.583, 73.010]
      ],
      color: 'blue',
    },
    {
      name: "UC Gujar Khan",
      coords: [
        [33.510, 73.100], [33.515, 73.110], [33.520, 73.105], [33.518, 73.095], [33.513, 73.090]
      ],
      color: 'red',
    }
  ],

  "Sialkot": [
    {
      name: "UC Sambrial",
      coords: [
        [32.490, 74.520], [32.495, 74.530], [32.500, 74.525], [32.498, 74.515], [32.493, 74.510]
      ],
      color: 'blue',
    },
    {
      name: "UC Daska",
      coords: [
        [32.320, 74.510], [32.325, 74.520], [32.330, 74.515], [32.328, 74.505], [32.323, 74.500]
      ],
      color: 'red',
    },
    {
      name: "UC Pasrur",
      coords: [
        [32.350, 74.480], [32.355, 74.490], [32.360, 74.485], [32.358, 74.475], [32.353, 74.470]
      ],
      color: 'blue',
    }
  ],

  "Sargodha": [
    {
      name: "UC Bhalwal",
      coords: [
        [32.250, 72.700], [32.255, 72.710], [32.260, 72.705], [32.258, 72.695], [32.253, 72.690]
      ],
      color: 'red',
    },
    {
      name: "UC Kot Momin",
      coords: [
        [32.350, 72.680], [32.355, 72.690], [32.360, 72.685], [32.358, 72.675], [32.353, 72.670]
      ],
      color: 'blue',
    },
    {
      name: "UC Shahpur",
      coords: [
        [32.120, 72.670], [32.125, 72.680], [32.130, 72.675], [32.128, 72.665], [32.123, 72.660]
      ],
      color: 'red',
    }
  ],

  "Sahiwal": [
    {
      name: "UC Chichawatni",
      coords: [
        [30.700, 73.100], [30.705, 73.110], [30.710, 73.105], [30.708, 73.095], [30.703, 73.090]
      ],
      color: 'blue',
    },
    {
      name: "UC Okara Road",
      coords: [
        [30.650, 73.130], [30.655, 73.140], [30.660, 73.135], [30.658, 73.125], [30.653, 73.120]
      ],
      color: 'red',
    },
    {
      name: "UC Depalpur",
      coords: [
        [30.670, 73.090], [30.675, 73.100], [30.680, 73.095], [30.678, 73.085], [30.673, 73.080]
      ],
      color: 'blue',
    }
  ],

  "Bahawalpur": [
    {
      name: "UC Ahmadpur East",
      coords: [
        [29.400, 71.670], [29.405, 71.680], [29.410, 71.675], [29.408, 71.665], [29.403, 71.660]
      ],
      color: 'red',
    },
    {
      name: "UC Yazman",
      coords: [
        [29.300, 71.620], [29.305, 71.630], [29.310, 71.625], [29.308, 71.615], [29.303, 71.610]
      ],
      color: 'blue',
    },
    {
      name: "UC Hasilpur",
      coords: [
        [29.650, 71.780], [29.655, 71.790], [29.660, 71.785], [29.658, 71.775], [29.653, 71.770]
      ],
      color: 'red',
    }
  ],

  "Sheikhupura": [
    {
      name: "UC Ferozewala",
      coords: [
        [31.210, 73.970], [31.215, 73.980], [31.220, 73.975], [31.218, 73.965], [31.213, 73.960]
      ],
      color: 'blue',
    },
    {
      name: "UC Muridke",
      coords: [
        [31.350, 74.000], [31.355, 74.010], [31.360, 74.005], [31.358, 73.995], [31.353, 73.990]
      ],
      color: 'red',
    },
    {
      name: "UC Safdarabad",
      coords: [
        [31.730, 73.940], [31.735, 73.950], [31.740, 73.945], [31.738, 73.935], [31.733, 73.930]
      ],
      color: 'blue',
    }
  ],

  "Jhelum": [
    {
      name: "UC Pind Dadan Khan",
      coords: [
        [32.580, 73.620], [32.585, 73.630], [32.590, 73.625], [32.588, 73.615], [32.583, 73.610]
      ],
      color: 'red',
    },
    {
      name: "UC Sohawa",
      coords: [
        [32.920, 73.740], [32.925, 73.750], [32.930, 73.745], [32.928, 73.735], [32.923, 73.730]
      ],
      color: 'blue',
    },
    {
      name: "UC Dina",
      coords: [
        [32.930, 73.700], [32.935, 73.710], [32.940, 73.705], [32.938, 73.695], [32.933, 73.690]
      ],
      color: 'red',
    }
  ],

  "Okara": [
    {
      name: "UC Renala Khurd",
      coords: [
        [30.830, 73.430], [30.835, 73.440], [30.840, 73.435], [30.838, 73.425], [30.833, 73.420]
      ],
      color: 'blue',
    },
    {
      name: "UC Depalpur",
      coords: [
        [30.820, 73.460], [30.825, 73.470], [30.830, 73.465], [30.828, 73.455], [30.823, 73.450]
      ],
      color: 'red',
    },
    {
      name: "UC Pakpattan",
      coords: [
        [30.370, 73.390], [30.375, 73.400], [30.380, 73.395], [30.378, 73.385], [30.373, 73.380]
      ],
      color: 'blue',
    }
  ],

  "Dera Ghazi Khan": [
    {
      name: "UC Kot Chutta",
      coords: [
        [30.020, 70.620], [30.025, 70.630], [30.030, 70.625], [30.028, 70.615], [30.023, 70.610]
      ],
      color: 'red',
    },
    {
      name: "UC Taunsa",
      coords: [
        [30.060, 70.660], [30.065, 70.670], [30.070, 70.665], [30.068, 70.655], [30.063, 70.650]
      ],
      color: 'blue',
    },
    {
      name: "UC Tribal Area",
      coords: [
        [30.045, 70.640], [30.050, 70.650], [30.055, 70.645], [30.053, 70.635], [30.048, 70.630]
      ],
      color: 'red',
    }
  ],
};


// Array to hold all employees
let employees = [];
let idCounter = 1;

// ---------------------------
// Generate employees for districts, including one per UC polygon inside polygon centroid
// ---------------------------
function generateEmployees() {
  employees = [];
  idCounter = 1;

  provincesData["Punjab"].forEach(district => {
    const [baseLat, baseLng] = districtCoords[district];
    const numEmployees = Math.floor(Math.random() * 6) + 10; // 10-15 employees

    // Generate normal employees randomly scattered near district center
    for (let i = 0; i < numEmployees; i++) {
      let [lat, lng] = randomCoord(baseLat, baseLng, 0.1);

      const role = roles[Math.floor(Math.random() * roles.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      // Create a track path only if status is moving
      let track = null;
      if (status === "moving") {
        track = [];
        let prevLat = lat;
        let prevLng = lng;
        for (let t = 0; t < 5; t++) {
          prevLat += (Math.random() - 0.5) * 0.005;
          prevLng += (Math.random() - 0.5) * 0.005;
          track.push({ lat: prevLat, lng: prevLng });
        }
      }

      employees.push({
        id: `E${String(idCounter).padStart(3, '0')}`,
        name: `Emp ${idCounter}`,
        role,
        status,
        province: "Punjab",
        district,
        facility: `${district}-Disp-${String(i + 1).padStart(2, '0')}`,
        lat,
        lng,
        last_seen: `2025-08-11 ${String(8 + Math.floor(Math.random() * 10)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2,'0')}`,
        visits_today: Math.floor(Math.random() * 5),
        perf_score: Math.floor(Math.random() * 100),
        track,  // added here
      });
      idCounter++;
    }

    // Add one employee per polygon UC inside its centroid with status red or blue only
    if (geofencePolygons[district]) {
      geofencePolygons[district].forEach((uc, idx) => {
        let latSum = 0, lngSum = 0;
        uc.coords.forEach(c => {
          latSum += c[0];
          lngSum += c[1];
        });
        const centroid = [latSum / uc.coords.length, lngSum / uc.coords.length];

        const status = Math.random() < 0.5 ? "static" : "non-performer";
        const statusColor = status === "static" ? "static" : "non-performer";

        employees.push({
          id: `UC${district[0]}-${idx + 1}`,
          name: `UC Emp ${idx + 1} (${uc.name})`,
          role: roles[Math.floor(Math.random() * roles.length)],
          status: statusColor,
          province: "Punjab",
          district,
          facility: `${district}-UC-${idx + 1}`,
          lat: centroid[0],
          lng: centroid[1],
          last_seen: "2025-08-11 10:00",
          visits_today: 0,
          perf_score: 0,
          ucName: uc.name,
          isFenced: true,
          polygonColor: uc.color
        });
      });
    }
  });
}


// ---------------------------
// Leaflet map & markers
// ---------------------------
let map;
let markers = [];
let currentPolyline = null;
const polygonLayers = [];

const INITIAL_MAP_CENTER = [31.5204, 74.3587]; // Lahore center
const INITIAL_MAP_ZOOM = 13;

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
  fenced: L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  }),
};

// Utility: point in polygon test (ray-casting)
function isPointInPolygon(point, vs) {
  const x = point[1], y = point[0];

  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][1], yi = vs[i][0];
    const xj = vs[j][1], yj = vs[j][0];

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Check if employee inside a polygon
function isInsidePolygon(lat, lng, polygon) {
  const polyLatLngs = polygon.getLatLngs()[0].map(ll => [ll.lat, ll.lng]);
  return isPointInPolygon([lat, lng], polyLatLngs);
}

// Clear all markers
function clearMarkers() {
  markers.forEach(m => m.remove());
  markers = [];
}

// Clear polyline
function clearPolyline() {
  if (currentPolyline) {
    currentPolyline.remove();
    currentPolyline = null;
  }
}

// Render polygons on map
function renderPolygons() {
  polygonLayers.forEach(p => p.remove());
  polygonLayers.length = 0;

  Object.entries(geofencePolygons).forEach(([district, ucs]) => {
    ucs.forEach(uc => {
      const polygon = L.polygon(uc.coords, {
        color: uc.color,
        fillColor: uc.color,
        fillOpacity: 0.2,
        weight: 3,
        dashArray: '6,4',
      }).addTo(map);
      polygon.ucName = uc.name;
      polygon.district = district;
      polygonLayers.push(polygon);

      polygon.on('click', () => {
        alert(`Union Council: ${uc.name}\nDistrict: ${district}`);
      });
    });
  });
}

// Render markers and employee list
function renderMarkers(data) {
  clearMarkers();
  updateEmployeeList(data);

  data.forEach(emp => {
    let icon = ICONS[emp.status] || ICONS.moving;
    if(emp.isFenced){
      // Fenced employees get special icon based on status
      icon = emp.status === "static" ? ICONS.static : ICONS["non-performer"];
    }

    const marker = L.marker([emp.lat, emp.lng], { icon }).addTo(map);
    marker.on("click", () => onMarkerClick(emp, marker));
    markers.push(marker);
  });
}

// Marker click popup with details
function onMarkerClick(emp, marker) {
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

  if(emp.isFenced) {
    popupHtml += `<strong>Union Council:</strong> ${emp.ucName}<br/>`;
    popupHtml += `<em>This employee works within this geofence polygon.</em><br/>`;
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

// Apply filters from UI
function applyFilters() {
  const province = document.getElementById("provinceSelect").value;
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

// Reset filters to default
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

// Update employee list dropdown
function updateEmployeeList(data) {
  const select = document.getElementById("employeeSelect");
  select.innerHTML = '<option value="" disabled selected>Employee List</option>';

  data.forEach(emp => {
    const option = document.createElement("option");
    option.value = emp.id;
    option.textContent = `${emp.name} (${emp.id}) — ${emp.role}`;
    select.appendChild(option);
  });

  select.value = "";

  select.onchange = () => {
    const selectedId = select.value;
    const emp = employees.find(e => e.id === selectedId);
    if (emp) {
      map.setView([emp.lat, emp.lng], 14);
    }
  };
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  map = L.map('map').setView(INITIAL_MAP_CENTER, INITIAL_MAP_ZOOM);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  generateEmployees();
  renderPolygons();
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
