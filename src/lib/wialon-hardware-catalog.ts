export type HardwareBrandId =
  | "teltonika"
  | "queclink"
  | "suntech"
  | "concox"
  | "coban"
  | "meitrack"
  | "calamp"
  | "ruptela"
  | "sinotrack"
  | "topflytech"
  | "generic";

export type YearRange = "all" | "legacy_pre2022" | "modern_2022_plus";

export type HardwareModelInfo = {
  id: string;
  name: string;
  brand: HardwareBrandId;
  wialonHwPort: number;
  wialonHwNames: string[];
  defaultPassword?: string;
  supportedYears: Array<{ id: YearRange; label: string }>;
  description: string;
};

export type ApnPreset = {
  carrier: string;
  apn: string;
  user: string;
  pass: string;
};

export const COMMON_APNS: ApnPreset[] = [
  { carrier: "Telcel México (Default)", apn: "internet.itelcel.com", user: "webgprs", pass: "webgprs2002" },
  { carrier: "Telcel M2M / IoT", apn: "m2m.itelcel.com", user: "", pass: "" },
  { carrier: "AT&T México / Unefon", apn: "modem.iusacell.com.mx", user: "", pass: "" },
  { carrier: "Movistar México", apn: "internet.movistar.mx", user: "movistar", pass: "movistar" },
  { carrier: "Altán Redes / OMV (Bait, etc.)", apn: "altanredes", user: "", pass: "" },
  { carrier: "SIM Global Multi-Carrier M2M", apn: "globaldata.m2m", user: "", pass: "" },
];

export type HardwareBrandDef = {
  id: HardwareBrandId;
  name: string;
  country: string;
  headerRule: string;
  smsSyntax: string;
  gprsSyntax: string;
  defaultPass: string;
  notes: string;
  diagram: {
    delimiter: string;
    prefix: string;
    suffix: string;
    structure: string;
  };
  models: HardwareModelInfo[];
  buildResetCommand: (model: string, year: YearRange, pass: string, imei?: string) => string;
  buildGpsResetCommand: (model: string, year: YearRange, pass: string, imei?: string) => string;
  buildApnCommand: (model: string, year: YearRange, pass: string, apn: ApnPreset, imei?: string) => string;
  buildServerCommand: (
    model: string,
    year: YearRange,
    pass: string,
    ipOrHost: string,
    port: number,
    protocol: "tcp" | "udp",
    imei?: string
  ) => string;
  buildIntervalCommand: (
    model: string,
    year: YearRange,
    pass: string,
    movingSec: number,
    stoppedSec: number,
    imei?: string
  ) => string;
  buildEngineCutCommand: (model: string, year: YearRange, pass: string, enable: boolean, imei?: string) => string;
  buildStatusCommand: (model: string, year: YearRange, pass: string, imei?: string) => string;
};

export const HARDWARE_CATALOG: Record<HardwareBrandId, HardwareBrandDef> = {
  teltonika: {
    id: "teltonika",
    name: "Teltonika Telematics",
    country: "Lituania (UE)",
    headerRule: "Para SMS requiere 2 espacios previos si no tiene contraseña, o 'user pass comando'.",
    smsSyntax: "  <comando> o <usuario> <password> <comando>",
    gprsSyntax: "cpureset / setparam ID:VALOR",
    defaultPass: "",
    notes: "Fabricante líder en Europa y México. Los equipos 2022+ utilizan firmware FMB.Ver.03.xx con IDs de parámetros estandarizados.",
    diagram: {
      delimiter: "Espacio o punto y coma (;) para setparam",
      prefix: "2 espacios o '<user> <pass> '",
      suffix: "Ninguno",
      structure: "[2 espacios / pass] + [comando: setparam / cpureset / setdigout]",
    },
    models: [
      {
        id: "fmb920",
        name: "Teltonika FMB920 (2G Compacto)",
        brand: "teltonika",
        wialonHwPort: 20275,
        wialonHwNames: ["Teltonika FMB920", "FMB920", "Teltonika"],
        supportedYears: [
          { id: "all", label: "Todos los años (Firmware 03.xx)" },
          { id: "modern_2022_plus", label: "2022 en adelante (Firma dual)" },
          { id: "legacy_pre2022", label: "Anterior a 2022" },
        ],
        description: "El rastreador más instalado. Entrada digital, salida para relevador paro de motor y bluetooth.",
      },
      {
        id: "fmc130",
        name: "Teltonika FMC130 (4G LTE Cat 1)",
        brand: "teltonika",
        wialonHwPort: 20275,
        wialonHwNames: ["Teltonika FMC130", "FMC130"],
        supportedYears: [
          { id: "all", label: "4G LTE Estándar" },
        ],
        description: "Rastreador avanzado 4G con soporte de antenas internas e inmovilizador.",
      },
      {
        id: "fmb120",
        name: "Teltonika FMB120 (Dual SIM / Batería interna)",
        brand: "teltonika",
        wialonHwPort: 20275,
        wialonHwNames: ["Teltonika FMB120", "FMB120"],
        supportedYears: [{ id: "all", label: "Todas las versiones" }],
        description: "Equipo con doble ranura SIM y múltiples entradas para sensores de combustible.",
      },
      {
        id: "fmc920",
        name: "Teltonika FMC920 (4G LTE Compacto)",
        brand: "teltonika",
        wialonHwPort: 20275,
        wialonHwNames: ["Teltonika FMC920", "FMC920"],
        supportedYears: [{ id: "all", label: "Moderno 2022+" }],
        description: "Evolución 4G Cat 1 del FMB920.",
      },
    ],
    buildResetCommand: (_model, _year, pass) => {
      const p = pass ? `${pass} ` : "  ";
      return `${p}cpureset`;
    },
    buildGpsResetCommand: (_model, _year, pass) => {
      const p = pass ? `${pass} ` : "  ";
      return `${p}setparam 20000:1`;
    },
    buildApnCommand: (_model, year, pass, apn) => {
      const p = pass ? `${pass} ` : "  ";
      if (year === "modern_2022_plus") {
        return `${p}setparam 2001:${apn.apn};2002:${apn.user};2003:${apn.pass}`;
      }
      return `${p}setparam 2001:${apn.apn};2002:${apn.user};2003:${apn.pass}`;
    },
    buildServerCommand: (_model, _year, pass, ipOrHost, port, protocol) => {
      const p = pass ? `${pass} ` : "  ";
      const protoCode = protocol === "udp" ? "1" : "0";
      return `${p}setparam 2004:${ipOrHost};2005:${port};2006:${protoCode}`;
    },
    buildIntervalCommand: (_model, _year, pass, movingSec, stoppedSec) => {
      const p = pass ? `${pass} ` : "  ";
      return `${p}setparam 10000:${movingSec};10001:${stoppedSec};10002:30`;
    },
    buildEngineCutCommand: (_model, _year, pass, enable) => {
      const p = pass ? `${pass} ` : "  ";
      return `${p}setdigout ${enable ? "1" : "0"}`;
    },
    buildStatusCommand: (_model, _year, pass) => {
      const p = pass ? `${pass} ` : "  ";
      return `${p}getinfo`;
    },
  },

  queclink: {
    id: "queclink",
    name: "Queclink Wireless Solutions",
    country: "China",
    headerRule: "Comandos estilo AT+GT... terminados con signo de pesos ($) y correlativo.",
    smsSyntax: "AT+GT<CMD>=<password>,<parametros>,,,,<secuencia>$",
    gprsSyntax: "AT+GT<CMD>=<password>,<parametros>,,,,<secuencia>$",
    defaultPass: "gv300",
    notes: "Fabricante ampliamente homologado. Modelos pre-2020 usan contraseñas fijas como 'gv300', 'gv50'. Modelos modernos (GV300W/LAU) suelen requerir el sufijo de secuencia como '0001$'.",
    diagram: {
      delimiter: "Comas (,)",
      prefix: "AT+GT",
      suffix: "$",
      structure: "AT+GT<CMD>=<pass>,<p1>,<p2>,...,<secuencia>$",
    },
    models: [
      {
        id: "gv300",
        name: "Queclink GV300 / GV300W",
        brand: "queclink",
        wialonHwPort: 20409,
        wialonHwNames: ["Queclink GV300", "Queclink GV300W", "GV300"],
        defaultPassword: "gv300",
        supportedYears: [
          { id: "modern_2022_plus", label: "2020+ (GV300W / 4G LAU)" },
          { id: "legacy_pre2022", label: "Pre-2020 (GV300 Clásico 2G)" },
        ],
        description: "Equipo robusto para vehículos pesados y ligeros.",
      },
      {
        id: "gl300",
        name: "Queclink GL300 / GL300W (Portátil)",
        brand: "queclink",
        wialonHwPort: 20409,
        wialonHwNames: ["Queclink GL300", "GL300"],
        defaultPassword: "gl300",
        supportedYears: [{ id: "all", label: "Todas las versiones" }],
        description: "Localizador personal y para activos con batería recargable.",
      },
      {
        id: "gv50",
        name: "Queclink GV50 / GV55 (Económico)",
        brand: "queclink",
        wialonHwPort: 20409,
        wialonHwNames: ["Queclink GV50", "Queclink GV55"],
        defaultPassword: "gv50",
        supportedYears: [{ id: "all", label: "Todas las versiones" }],
        description: "Equipo micro de instalación oculta para motocicletas y autos.",
      },
    ],
    buildResetCommand: (_model, _year, pass) => {
      const pwd = pass || "gv300";
      return `AT+GTRST=${pwd},1,,,,,,0001$`;
    },
    buildGpsResetCommand: (_model, _year, pass) => {
      const pwd = pass || "gv300";
      return `AT+GTRST=${pwd},2,,,,,,0002$`;
    },
    buildApnCommand: (_model, _year, pass, apn) => {
      const pwd = pass || "gv300";
      return `AT+GTBBC=${pwd},${apn.apn},${apn.user},${apn.pass},,,,,,0003$`;
    },
    buildServerCommand: (_model, _year, pass, ipOrHost, port, protocol) => {
      const pwd = pass || "gv300";
      const mode = protocol === "udp" ? "0" : "1";
      return `AT+GTSRI=${pwd},${mode},,1,${ipOrHost},${port},,0,0,0,,,0004$`;
    },
    buildIntervalCommand: (_model, _year, pass, movingSec, stoppedSec) => {
      const pwd = pass || "gv300";
      return `AT+GTCFG=${pwd},${pwd},ORB,0,0,0,${movingSec},${stoppedSec},10,1,0,0,,,0005$`;
    },
    buildEngineCutCommand: (_model, _year, pass, enable) => {
      const pwd = pass || "gv300";
      return `AT+GTOUT=${pwd},${enable ? "1" : "0"},0,0,0,0,0,0,0,0,0,0006$`;
    },
    buildStatusCommand: (_model, _year, pass) => {
      const pwd = pass || "gv300";
      return `AT+GTINF=${pwd},1,,,,0007$`;
    },
  },

  suntech: {
    id: "suntech",
    name: "Suntech International",
    country: "Corea del Sur / Brasil",
    headerRule: "Comandos delimitados por punto y coma (;) con prefijo de modelo e IMEI.",
    smsSyntax: "ST300<TIPO>;<IMEI_O_HDR>;02;<PARAMETROS>",
    gprsSyntax: "ST300<TIPO>;<IMEI>;02;<PARAMETROS>",
    defaultPass: "",
    notes: "Equipos de alta fiabilidad. El protocolo utiliza comandos tipificados como ST300CMD, ST300NTW, ST300SVC.",
    diagram: {
      delimiter: "Punto y coma (;)",
      prefix: "ST300 o ST310U",
      suffix: "Ninguno",
      structure: "ST300<TIPO>;<IMEI>;<VER>;<COMANDO/VALORES>",
    },
    models: [
      {
        id: "st310u",
        name: "Suntech ST310U (Compacto 2G)",
        brand: "suntech",
        wialonHwPort: 20462,
        wialonHwNames: ["Suntech ST310U", "ST310U", "Suntech"],
        supportedYears: [{ id: "all", label: "Estándar" }],
        description: "Muy popular en flotas mexicanas por su resistencia.",
      },
      {
        id: "st340",
        name: "Suntech ST340 (4G LTE / Carcasa IP67)",
        brand: "suntech",
        wialonHwPort: 20462,
        wialonHwNames: ["Suntech ST340", "ST340"],
        supportedYears: [{ id: "all", label: "4G LTE Resistente" }],
        description: "Equipo sellado resistente al agua para maquinaria y motos.",
      },
    ],
    buildResetCommand: (_model, _year, _pass, imei) => {
      const devImei = imei || "000000000000000";
      return `ST300CMD;${devImei};02;Reset`;
    },
    buildGpsResetCommand: (_model, _year, _pass, imei) => {
      const devImei = imei || "000000000000000";
      return `ST300CMD;${devImei};02;GPSReset`;
    },
    buildApnCommand: (_model, _year, _pass, apn, imei) => {
      const devImei = imei || "000000000000000";
      return `ST300NTW;${devImei};02;${apn.apn};${apn.user};${apn.pass};;`;
    },
    buildServerCommand: (_model, _year, _pass, ipOrHost, port, _proto, imei) => {
      const devImei = imei || "000000000000000";
      return `ST300SVC;${devImei};02;1;${ipOrHost};${port};;`;
    },
    buildIntervalCommand: (_model, _year, _pass, movingSec, stoppedSec, imei) => {
      const devImei = imei || "000000000000000";
      return `ST300RPT;${devImei};02;${movingSec};${stoppedSec};10;0`;
    },
    buildEngineCutCommand: (_model, _year, _pass, enable, imei) => {
      const devImei = imei || "000000000000000";
      return `ST300CMD;${devImei};02;Output1_${enable ? "1" : "0"}`;
    },
    buildStatusCommand: (_model, _year, _pass, imei) => {
      const devImei = imei || "000000000000000";
      return `ST300CMD;${devImei};02;Status`;
    },
  },

  concox: {
    id: "concox",
    name: "Concox / Jimi IoT",
    country: "China",
    headerRule: "Comandos SMS en MAYÚSCULAS delimitados por comas y terminados en almohadilla (#).",
    smsSyntax: "<COMANDO>,<PARAMETROS>#",
    gprsSyntax: "<COMANDO>,<PARAMETROS>#",
    defaultPass: "",
    notes: "Línea GT06N y nueva generación Jimi VL03/VL02 4G. El caracter final '#' es obligatorio.",
    diagram: {
      delimiter: "Coma (,)",
      prefix: "Ninguno",
      suffix: "#",
      structure: "<PALABRA_CLAVE>,<PARAM1>,<PARAM2>#",
    },
    models: [
      {
        id: "gt06n",
        name: "Concox GT06N (2G Clásico)",
        brand: "concox",
        wialonHwPort: 20281,
        wialonHwNames: ["Concox GT06N", "GT06N", "Concox"],
        supportedYears: [{ id: "legacy_pre2022", label: "2G Clásico" }],
        description: "Equipo ampliamente distribuido para taxis, particulares y flotas.",
      },
      {
        id: "jimi_vl03",
        name: "Jimi IoT VL03 (4G LTE)",
        brand: "concox",
        wialonHwPort: 20281,
        wialonHwNames: ["Jimi VL03", "VL03", "Concox VL03"],
        supportedYears: [{ id: "modern_2022_plus", label: "4G LTE 2022+" }],
        description: "Versión moderna 4G LTE Cat 1 con apagado remoto inteligente.",
      },
    ],
    buildResetCommand: () => "RESET#",
    buildGpsResetCommand: () => "GPSRESET#",
    buildApnCommand: (_m, _y, _p, apn) => {
      if (apn.user) {
        return `APN,${apn.apn},${apn.user},${apn.pass}#`;
      }
      return `APN,${apn.apn}#`;
    },
    buildServerCommand: (_m, _y, _p, ipOrHost, port, proto) => {
      const mode = proto === "udp" ? "0" : "1";
      return `SERVER,${mode},${ipOrHost},${port},0#`;
    },
    buildIntervalCommand: (_m, _y, _p, movingSec, stoppedSec) => `TIMER,${movingSec},${stoppedSec}#`,
    buildEngineCutCommand: (_m, _y, _p, enable) => (enable ? "RELAY,1#" : "RELAY,0#"),
    buildStatusCommand: () => "STATUS#",
  },

  coban: {
    id: "coban",
    name: "Coban / Xexun (GPS103 / TK103)",
    country: "China",
    headerRule: "Comandos directos seguidos de contraseña por defecto '123456'.",
    smsSyntax: "<comando><password> <parametros>",
    gprsSyntax: "<comando><password> <parametros>",
    defaultPass: "123456",
    notes: "El modelo pionero en GPS. Utiliza siempre la contraseña de 6 dígitos pegada al comando (ej: reset123456, check123456).",
    diagram: {
      delimiter: "Espacio entre comando+pass y parámetros",
      prefix: "Ninguno",
      suffix: "Ninguno",
      structure: "<comando><123456> [parametro]",
    },
    models: [
      {
        id: "gps103",
        name: "Coban GPS103A / TK103B",
        brand: "coban",
        wialonHwPort: 20222,
        wialonHwNames: ["Coban GPS103", "TK103", "Coban"],
        defaultPassword: "123456",
        supportedYears: [{ id: "all", label: "Todas las versiones" }],
        description: "Equipo legendario con relevador, micrófono y botón de pánico.",
      },
      {
        id: "gps303",
        name: "Coban GPS303G / 311 (Sellado)",
        brand: "coban",
        wialonHwPort: 20222,
        wialonHwNames: ["Coban GPS303", "GPS303G", "Coban GPS311"],
        defaultPassword: "123456",
        supportedYears: [{ id: "all", label: "Todas las versiones" }],
        description: "Diseño compacto sellado para motos y autos.",
      },
    ],
    buildResetCommand: (_m, _y, pass) => `reset${pass || "123456"}`,
    buildGpsResetCommand: (_m, _y, pass) => `fix020s***n${pass || "123456"}`,
    buildApnCommand: (_m, _y, pass, apn) => {
      const p = pass || "123456";
      if (apn.user) {
        return `apn${p} ${apn.apn}\napnuser${p} ${apn.user}\napnpasswd${p} ${apn.pass}`;
      }
      return `apn${p} ${apn.apn}`;
    },
    buildServerCommand: (_m, _y, pass, ipOrHost, port) => {
      const p = pass || "123456";
      return `adminip${p} ${ipOrHost} ${port}`;
    },
    buildIntervalCommand: (_m, _y, pass, movingSec) => {
      const p = pass || "123456";
      const pad = String(movingSec).padStart(3, "0");
      return `fix0${pad}s***n${p}`;
    },
    buildEngineCutCommand: (_m, _y, pass, enable) => {
      const p = pass || "123456";
      return enable ? `stop${p}` : `resume${p}`;
    },
    buildStatusCommand: (_m, _y, pass) => `check${pass || "123456"}`,
  },

  meitrack: {
    id: "meitrack",
    name: "Meitrack Group",
    country: "China / Taiwán",
    headerRule: "Comandos iniciados con contraseña de 4 dígitos (0000 por defecto) y código de función.",
    smsSyntax: "0000,<CODIGO>,<PARAMETROS>",
    gprsSyntax: "@@<LONGITUD>,<IMEI>,<CODIGO>,<PARAMETROS>*<CHECKSUM>",
    defaultPass: "0000",
    notes: "Equipos de gama media-alta para logística y transporte público.",
    diagram: {
      delimiter: "Coma (,)",
      prefix: "0000,",
      suffix: "Ninguno",
      structure: "<pass>,<codigo_funcion>,<parametros>",
    },
    models: [
      {
        id: "t333",
        name: "Meitrack T333 (3G / 4G)",
        brand: "meitrack",
        wialonHwPort: 20353,
        wialonHwNames: ["Meitrack T333", "Meitrack", "T333"],
        defaultPassword: "0000",
        supportedYears: [{ id: "all", label: "Estándar" }],
        description: "Rastreador avanzado para transporte pesado.",
      },
    ],
    buildResetCommand: (_m, _y, pass) => `${pass || "0000"},G02`,
    buildGpsResetCommand: (_m, _y, pass) => `${pass || "0000"},G03`,
    buildApnCommand: (_m, _y, pass, apn) => `${pass || "0000"},A21,1,${apn.apn},${apn.user},${apn.pass}`,
    buildServerCommand: (_m, _y, pass, ipOrHost, port) => `${pass || "0000"},A21,2,${ipOrHost},${port}`,
    buildIntervalCommand: (_m, _y, pass, movingSec, stoppedSec) => `${pass || "0000"},B06,${movingSec},${stoppedSec}`,
    buildEngineCutCommand: (_m, _y, pass, enable) => `${pass || "0000"},C01,1,${enable ? "1" : "0"}`,
    buildStatusCommand: (_m, _y, pass) => `${pass || "0000"},B03`,
  },

  calamp: {
    id: "calamp",
    name: "CalAmp Wireless",
    country: "Estados Unidos",
    headerRule: "Comandos de protocolo PEG (Pulsed Event Generator) con prefijo de exclamación '!'.",
    smsSyntax: "!<CMD>,<PARAMETROS>",
    gprsSyntax: "!<CMD>,<PARAMETROS>",
    defaultPass: "",
    notes: "Equipos de estándar militar y aseguradoras de Estados Unidos.",
    diagram: {
      delimiter: "Coma (,)",
      prefix: "!",
      suffix: "Ninguno",
      structure: "!<CMD>,<PARAMETROS>",
    },
    models: [
      {
        id: "lmu2600",
        name: "CalAmp LMU-2600 / 3030",
        brand: "calamp",
        wialonHwPort: 20500,
        wialonHwNames: ["CalAmp LMU-2600", "CalAmp LMU", "CalAmp"],
        supportedYears: [{ id: "all", label: "Estándar" }],
        description: "Hardware de nivel OEM para empresas corporativas.",
      },
    ],
    buildResetCommand: () => "!R0",
    buildGpsResetCommand: () => "!R3",
    buildApnCommand: (_m, _y, _p, apn) => `!P1,0,0,${apn.apn}`,
    buildServerCommand: (_m, _y, _p, ipOrHost, port) => `!P1,2,0,${ipOrHost},${port}`,
    buildIntervalCommand: (_m, _y, _p, movingSec) => `!P0,0,0,${movingSec}`,
    buildEngineCutCommand: (_m, _y, _p, enable) => `!R2,${enable ? "1" : "0"}`,
    buildStatusCommand: () => "!R1",
  },

  ruptela: {
    id: "ruptela",
    name: "Ruptela",
    country: "Lituania",
    headerRule: "Comando con espacio previo para SMS.",
    smsSyntax: " <comando>",
    gprsSyntax: "<comando>",
    defaultPass: "",
    notes: "Fabricante europeo enfocado en eco-conducción y lectura CAN bus FMS.",
    diagram: {
      delimiter: "Espacio",
      prefix: "1 espacio",
      suffix: "Ninguno",
      structure: " <comando>",
    },
    models: [
      {
        id: "eco4",
        name: "Ruptela Eco4 / HCV5",
        brand: "ruptela",
        wialonHwPort: 20188,
        wialonHwNames: ["Ruptela Eco4", "Ruptela HCV5", "Ruptela"],
        supportedYears: [{ id: "all", label: "Estándar" }],
        description: "Monitoreo de combustible de alta precisión y tacógrafo digital.",
      },
    ],
    buildResetCommand: () => " device_reset",
    buildGpsResetCommand: () => " gps_restart",
    buildApnCommand: (_m, _y, _p, apn) => ` set_apn ${apn.apn} ${apn.user} ${apn.pass}`,
    buildServerCommand: (_m, _y, _p, ipOrHost, port) => ` set_server ${ipOrHost} ${port}`,
    buildIntervalCommand: (_m, _y, _p, movingSec) => ` set_record_interval ${movingSec}`,
    buildEngineCutCommand: (_m, _y, _p, enable) => ` set_dout 1 ${enable ? "1" : "0"}`,
    buildStatusCommand: () => " get_status",
  },

  sinotrack: {
    id: "sinotrack",
    name: "SinoTrack",
    country: "China",
    headerRule: "Códigos numéricos con contraseña por defecto '0000'.",
    smsSyntax: "<CODIGO><PASSWORD> <PARAMETROS>",
    gprsSyntax: "<CODIGO><PASSWORD> <PARAMETROS>",
    defaultPass: "0000",
    notes: "Muy común en motocicletas y vehículos particulares por su costo accesible.",
    diagram: {
      delimiter: "Espacio",
      prefix: "Código de 3 dígitos",
      suffix: "Ninguno",
      structure: "<CODIGO><0000> [VALOR]",
    },
    models: [
      {
        id: "st901",
        name: "SinoTrack ST-901 / ST-905",
        brand: "sinotrack",
        wialonHwPort: 20601,
        wialonHwNames: ["SinoTrack ST-901", "ST-901", "SinoTrack"],
        defaultPassword: "0000",
        supportedYears: [{ id: "all", label: "Estándar" }],
        description: "Equipo sellado resistente al agua.",
      },
    ],
    buildResetCommand: () => "RESTART",
    buildGpsResetCommand: () => "RESET",
    buildApnCommand: (_m, _y, pass, apn) => `803${pass || "0000"} ${apn.apn}`,
    buildServerCommand: (_m, _y, pass, ipOrHost, port) => `804${pass || "0000"} ${ipOrHost} ${port}`,
    buildIntervalCommand: (_m, _y, pass, movingSec) => `805${pass || "0000"} ${movingSec}`,
    buildEngineCutCommand: (_m, _y, pass, enable) => (enable ? `940${pass || "0000"}` : `941${pass || "0000"}`),
    buildStatusCommand: () => "RCONF",
  },

  topflytech: {
    id: "topflytech",
    name: "Topflytech",
    country: "China",
    headerRule: "Comandos tipo TLW delimitados por comas terminados en '#'.",
    smsSyntax: "<CMD>,<PASSWORD>,<PARAMETROS>#",
    gprsSyntax: "<CMD>,<PASSWORD>,<PARAMETROS>#",
    defaultPass: "0000",
    notes: "Especialista en rastreo con panel solar y remolques de carga sin energía constante.",
    diagram: {
      delimiter: "Coma (,)",
      prefix: "Ninguno",
      suffix: "#",
      structure: "<CMD>,<pass>,<parametros>#",
    },
    models: [
      {
        id: "tlw2",
        name: "Topflytech TLW2-12B / SolarGuard",
        brand: "topflytech",
        wialonHwPort: 20800,
        wialonHwNames: ["Topflytech TLW2", "Topflytech"],
        defaultPassword: "0000",
        supportedYears: [{ id: "all", label: "4G Solar" }],
        description: "Batería de larga duración y carga solar.",
      },
    ],
    buildResetCommand: (_m, _y, pass) => `RESET,${pass || "0000"}#`,
    buildGpsResetCommand: (_m, _y, pass) => `GPSRESET,${pass || "0000"}#`,
    buildApnCommand: (_m, _y, pass, apn) => `APN,${pass || "0000"},${apn.apn},${apn.user},${apn.pass}#`,
    buildServerCommand: (_m, _y, pass, ipOrHost, port) => `IP,${pass || "0000"},${ipOrHost},${port}#`,
    buildIntervalCommand: (_m, _y, pass, movingSec, stoppedSec) => `TIMER,${pass || "0000"},${movingSec},${stoppedSec}#`,
    buildEngineCutCommand: (_m, _y, pass, enable) => `RELAY,${pass || "0000"},${enable ? "1" : "0"}#`,
    buildStatusCommand: (_m, _y, pass) => `STATUS,${pass || "0000"}#`,
  },

  generic: {
    id: "generic",
    name: "Equipo Genérico / Personalizado",
    country: "Internacional",
    headerRule: "Sintaxis libre personalizable.",
    smsSyntax: "<comando_libre>",
    gprsSyntax: "<comando_libre>",
    defaultPass: "",
    notes: "Permite introducir cualquier comando personalizado con reemplazo de variables {IMEI}, {APN}, {IP}, {PORT}.",
    diagram: {
      delimiter: "Libre",
      prefix: "Personalizado",
      suffix: "Personalizado",
      structure: "Comando sin plantilla rígida",
    },
    models: [
      {
        id: "custom",
        name: "Comando Libre / Protocolo Abierto",
        brand: "generic",
        wialonHwPort: 20275,
        wialonHwNames: ["Genérico"],
        supportedYears: [{ id: "all", label: "Cualquiera" }],
        description: "Envío directo sin restricciones de fabricante.",
      },
    ],
    buildResetCommand: () => "RESET",
    buildGpsResetCommand: () => "GPSRESET",
    buildApnCommand: (_m, _y, _p, apn) => `APN=${apn.apn}`,
    buildServerCommand: (_m, _y, _p, ipOrHost, port) => `SERVER=${ipOrHost}:${port}`,
    buildIntervalCommand: (_m, _y, _p, movingSec) => `INTERVAL=${movingSec}`,
    buildEngineCutCommand: (_m, _y, _p, enable) => (enable ? "CUT_ENGINE=1" : "CUT_ENGINE=0"),
    buildStatusCommand: () => "STATUS",
  },
};

/**
 * Detecta inteligentemente la marca y modelo a partir del nombre de la unidad,
 * el identificador de hardware de Wialon o el IMEI.
 */
export function detectHardwareFromUnit(unitName: string, imei?: string | null): {
  brand: HardwareBrandId;
  modelId: string;
  confidence: "high" | "medium" | "low";
} {
  const text = (unitName + " " + (imei ?? "")).toLowerCase();

  if (text.includes("fmb920") || text.includes("920")) {
    return { brand: "teltonika", modelId: "fmb920", confidence: "high" };
  }
  if (text.includes("fmc130") || text.includes("130")) {
    return { brand: "teltonika", modelId: "fmc130", confidence: "high" };
  }
  if (text.includes("fmb120") || text.includes("120")) {
    return { brand: "teltonika", modelId: "fmb120", confidence: "high" };
  }
  if (text.includes("fmc920")) {
    return { brand: "teltonika", modelId: "fmc920", confidence: "high" };
  }
  if (text.includes("teltonika") || text.includes("fmb") || text.includes("fmc")) {
    return { brand: "teltonika", modelId: "fmb920", confidence: "medium" };
  }

  if (text.includes("gv300") || text.includes("gv300w")) {
    return { brand: "queclink", modelId: "gv300", confidence: "high" };
  }
  if (text.includes("gl300")) {
    return { brand: "queclink", modelId: "gl300", confidence: "high" };
  }
  if (text.includes("gv50") || text.includes("gv55")) {
    return { brand: "queclink", modelId: "gv50", confidence: "high" };
  }
  if (text.includes("queclink")) {
    return { brand: "queclink", modelId: "gv300", confidence: "medium" };
  }

  if (text.includes("st310") || text.includes("st310u")) {
    return { brand: "suntech", modelId: "st310u", confidence: "high" };
  }
  if (text.includes("st340")) {
    return { brand: "suntech", modelId: "st340", confidence: "high" };
  }
  if (text.includes("suntech") || text.includes("st3")) {
    return { brand: "suntech", modelId: "st310u", confidence: "medium" };
  }

  if (text.includes("gt06") || text.includes("gt06n")) {
    return { brand: "concox", modelId: "gt06n", confidence: "high" };
  }
  if (text.includes("vl03") || text.includes("vl02")) {
    return { brand: "concox", modelId: "jimi_vl03", confidence: "high" };
  }
  if (text.includes("concox") || text.includes("jimi")) {
    return { brand: "concox", modelId: "gt06n", confidence: "medium" };
  }

  if (text.includes("tk103") || text.includes("gps103") || text.includes("103")) {
    return { brand: "coban", modelId: "gps103", confidence: "high" };
  }
  if (text.includes("gps303") || text.includes("gps311") || text.includes("303")) {
    return { brand: "coban", modelId: "gps303", confidence: "high" };
  }
  if (text.includes("coban") || text.includes("xexun")) {
    return { brand: "coban", modelId: "gps103", confidence: "medium" };
  }

  if (text.includes("sinotrack") || text.includes("st901") || text.includes("st-901")) {
    return { brand: "sinotrack", modelId: "st901", confidence: "high" };
  }

  if (text.includes("calamp") || text.includes("lmu")) {
    return { brand: "calamp", modelId: "lmu2600", confidence: "high" };
  }

  if (text.includes("meitrack") || text.includes("t333")) {
    return { brand: "meitrack", modelId: "t333", confidence: "high" };
  }

  if (text.includes("ruptela") || text.includes("eco4")) {
    return { brand: "ruptela", modelId: "eco4", confidence: "high" };
  }

  if (text.includes("topflytech") || text.includes("tlw")) {
    return { brand: "topflytech", modelId: "tlw2", confidence: "high" };
  }

  // Default: Teltonika FMB920 (es el más extendido en Wialon México)
  return { brand: "teltonika", modelId: "fmb920", confidence: "low" };
}
