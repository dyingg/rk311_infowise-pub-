# rk311_infowise

RK311 Vpn Proxy Detector

## Changes Day 1 😄

- ANN Computation moved to cloud
- Better Menu for navigating application
- Batch Processing





## Note: Breaking Changes
- Reportst are now added a lat,lng for use on map display on report. This breaks the report display for old reports in the database that do not have a lat,ling


UI build

```
yarn install
yarn package
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

Todos

- [ ] Move DB Connection Strings etc to a .env file




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