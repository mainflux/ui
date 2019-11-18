# Ngx-admin
The UI will be based in [ngx-admin](https://github.com/akveo/ngx-admin), an Admin template based on Angular 8+ and Nebular. We will use many ngx-admin modules to create the Edgeflux UI, for example:
- Auth
- Menu
- Tables
- Cards
- Tabs
- Notifications.
- Graphs

# Edgeflux
After Register and Login pages we access to the Dashboard where the main page is visible. On the left side the Menu contains links to pages:
- Dashboard
- Gateways
- Map
- Admin/System
- Admin/Grafana

## Dashboard Page
Set of ngx-admin cards informing about:
- Mainflux version used
- Number of owned gateways
- Gateways stats (Trafic, activity, etc)
- Map with gateway location markers
- List of last actives Gateways

## Gateways Page
List of user gateways with name, MAC and activity fields. If the user clicks on a row a modal pop-up. The modal contains 4 tabs:
- Config
- UI
- Terminal
- Video

### Config Tab
Set of ngx-admin cards:
- Gateway informations
- Update Button
- Map
- Messages stats

### UI Tab
Remote Mainflux, EdgeX and/or [Cockpit](https://cockpit-project.org/) UIs

### Teminal Tab
Remote Gateway tereminal

### Video Tab
Implement Wowza and EdgeD to display a video from MFX-1 camera

## Map Page
Set of ngx-admin cards:
- Gateway location stats and infos
- Map with all connected Gateways
- Filter system: Connected, Last seen, Trafic, Updates per region...

## Admin Page
### Sub menu with:
- System
- Grafana

### System
Set of ngx-admin cards:
- Gateways group infos
- Gateways trafic and sats
- Managemeent gateways versions list

### Grafana
Insert Grafana UI
