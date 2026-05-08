export const clients = [
  {
    id: 1,
    name: 'María Camila Torres',
    document: 'CC 1012456789',
    email: 'maria.torres@email.com',
    phone: '300 456 7890',
    type: 'Persona natural',
    status: 'Activo',
    city: 'Bogotá D.C.',
    cases: 2,
    lastUpdate: '2026-05-02'
  },
  {
    id: 2,
    name: 'Constructora Andina S.A.S.',
    document: 'NIT 901234567-8',
    email: 'legal@andina.com',
    phone: '601 455 8899',
    type: 'Persona jurídica',
    status: 'Activo',
    city: 'Medellín',
    cases: 3,
    lastUpdate: '2026-04-28'
  },
  {
    id: 3,
    name: 'Jorge Eduardo Peña',
    document: 'CC 79888333',
    email: 'jorge.pena@email.com',
    phone: '311 222 3344',
    type: 'Persona natural',
    status: 'En revisión',
    city: 'Cali',
    cases: 1,
    lastUpdate: '2026-04-18'
  },
  {
    id: 4,
    name: 'Comercial del Norte Ltda.',
    document: 'NIT 830987654-1',
    email: 'juridica@norte.com',
    phone: '605 333 2211',
    type: 'Persona jurídica',
    status: 'Inactivo',
    city: 'Barranquilla',
    cases: 0,
    lastUpdate: '2026-03-30'
  }
];

export const cases = [
  {
    id: 'CAS-2026-001',
    title: 'Liquidación laboral - contrato indefinido',
    client: 'María Camila Torres',
    area: 'Laboral',
    status: 'En trámite',
    priority: 'Alta',
    court: 'Juzgado 12 Laboral de Bogotá',
    nextHearing: '2026-05-12',
    progress: 68,
    lawyer: 'Juan S. Gonzalez'
  },
  {
    id: 'CAS-2026-002',
    title: 'Cobro ejecutivo comercial',
    client: 'Constructora Andina S.A.S.',
    area: 'Comercial',
    status: 'Abierto',
    priority: 'Media',
    court: 'Juzgado Civil del Circuito Medellín',
    nextHearing: '2026-05-19',
    progress: 42,
    lawyer: 'Juan S. Gonzalez'
  },
  {
    id: 'CAS-2026-003',
    title: 'Cuota alimentaria y regulación de visitas',
    client: 'Jorge Eduardo Peña',
    area: 'Familia',
    status: 'En revisión',
    priority: 'Alta',
    court: 'Comisaría de Familia Cali',
    nextHearing: '2026-05-24',
    progress: 25,
    lawyer: 'Juan S. Gonzalez'
  },
  {
    id: 'CAS-2026-004',
    title: 'Revisión de contrato de obra',
    client: 'Constructora Andina S.A.S.',
    area: 'Civil',
    status: 'Cerrado',
    priority: 'Baja',
    court: 'Conciliación privada',
    nextHearing: 'Sin audiencia',
    progress: 100,
    lawyer: 'Juan S. Gonzalez'
  }
];

export const documents = [
  { id: 1, name: 'Poder especial firmado.pdf', caseId: 'CAS-2026-001', type: 'Poder', size: '1.2 MB', uploadedAt: '2026-05-01', status: 'Vigente' },
  { id: 2, name: 'Contrato laboral.pdf', caseId: 'CAS-2026-001', type: 'Prueba', size: '880 KB', uploadedAt: '2026-05-02', status: 'Vigente' },
  { id: 3, name: 'Demanda ejecutiva.docx', caseId: 'CAS-2026-002', type: 'Procesal', size: '340 KB', uploadedAt: '2026-04-20', status: 'Borrador' },
  { id: 4, name: 'Acta de conciliación.pdf', caseId: 'CAS-2026-004', type: 'Acta', size: '510 KB', uploadedAt: '2026-03-19', status: 'Archivado' }
];

export const activities = [
  { id: 1, caseId: 'CAS-2026-001', title: 'Revisión de contrato y liquidación inicial', date: '2026-05-02', hours: 2.5, billable: true, status: 'Registrada' },
  { id: 2, caseId: 'CAS-2026-001', title: 'Llamada con cliente y solicitud de soportes', date: '2026-05-03', hours: 1, billable: true, status: 'Registrada' },
  { id: 3, caseId: 'CAS-2026-002', title: 'Preparación de demanda ejecutiva', date: '2026-04-29', hours: 3.5, billable: true, status: 'Pendiente' },
  { id: 4, caseId: 'CAS-2026-003', title: 'Análisis de capacidad económica', date: '2026-04-27', hours: 2, billable: false, status: 'Interna' }
];

export const users = [
  { id: 1, name: 'Juan S. Gonzalez', email: 'admin@jqpa.com', role: 'Administrador', status: 'Activo' },
  { id: 2, name: 'Laura Abogada', email: 'laura@jqpa.com', role: 'Abogado', status: 'Activo' },
  { id: 3, name: 'Carlos Ramírez', email: 'carlos.ramirez@jqpa.com', role: 'Abogado', status: 'Activo' }
];

export const legalConstants = [
  { label: 'SMMLV 2026', value: '$1.423.500' },
  { label: 'Auxilio de transporte', value: '$200.000' },
  { label: 'Interés cesantías', value: '12% anual' },
  { label: 'Jornada semanal', value: '46 horas' }
];
