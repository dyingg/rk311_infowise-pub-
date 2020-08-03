# rk311_infowise

RK311 Vpn Proxy Detector

## Note: Breaking Changes

- Reportst are now added a lat,lng for use on map display on report. This breaks the report display for old reports in the database that do not have a lat,ling

## TechStack

- Electron
- React
- Nodejs
- TensorFlow
- MongoDB
- Nmap (Interfaced)

## UI Build

The UI is made using react and bootstraped in the cra wrapper
https://github.com/dyingg/rk311_infowise/tree/master/static

How to build UI

```
cd /static
npm install
npm run start //dev
npm run build
```

## Electron Package

It is recomended to use yarn as the package manager for Electron, as electron-forge supports it by default

electron-forge allows electrons app to be build for cross platform usage easily.

For more on how to build for different platforms check the electron-forge project

```
yarn install
yarn start //Run with cli

//To build .exe
yarn package //-  Note: Placement of folders is important when packages into app.asar
```



## Building for the web

- Need to remove electron based code from ./src and ./static
- Need to wrap in express




## Python Modules

```

Our UI needs the PY AI models to be compiled from source before used

Requirements to run python modules

** Required Python Version: 3.7 **

```

pip3 install tensorflow==1.15.0
pip3 install keras==2.2.4
pip3 install ipaddress
pip3 install sklearn
pip3 install pandas
pip3 install numpy
pip3 install requests-html

```

**Sources**

- ASN Ranges: DB-IP ASN Lite
- IPStack GeoIp
- AL Blacklist

- Anti-Attacks BL
- AntiSpam_by_CleanTalk
- blacklists.co
- BlockList_de
- Botvrij.eu
- Brute Force Blocker
- bytefarm
- CI Army List
- IP Quality Score
- CruzIT Blocklist
- Feodo Tracker
- FSpamlist
- GPF DNS Blocklist
- Green Snow Blocklist
- ISX.fr DNSBL
- Lashback UBL
- Malc0de
- Myip.ms Blacklist
- pfBlocker NG
- Reuteras Scanning List
- Sblam
- SSL Blacklist
- Stop Forum Spam
- TalosIntel IP Filter
- Threat Sourcing
- Turris Greylist
- We have also mined out IPS from FREE+PAID Proxy VPNS

**Deployments**

1.) Reports Server is live on GCP -
```
