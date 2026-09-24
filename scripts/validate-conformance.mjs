#!/usr/bin/env node
/**
 * Dependency-free validator for HiveForge intent-reality conformance records.
 * It intentionally enforces the stable operational contract in
 * docs/constitution/conformance-record.schema.json without requiring npm setup.
 */
import { readFile } from 'node:fs/promises'

const file = process.argv[2]
if (!file) {
  console.error('Usage: node scripts/validate-conformance.mjs <record.json>')
  process.exit(2)
}

const fail = (message) => {
  console.error(`Invalid conformance record: ${message}`)
  process.exit(1)
}
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const requireObject = (value, name) => isObject(value) || fail(`${name} must be an object`)
const requireString = (value, name) => typeof value === 'string' && value.length > 0 || fail(`${name} must be a non-empty string`)
const requireArray = (value, name) => Array.isArray(value) && value.length > 0 || fail(`${name} must be a non-empty array`)
const requireEnum = (value, choices, name) => choices.includes(value) || fail(`${name} must be one of: ${choices.join(', ')}`)
const requireBoolean = (value, name) => typeof value === 'boolean' || fail(`${name} must be boolean`)

let record
try {
  record = JSON.parse(await readFile(file, 'utf8'))
} catch (error) {
  fail(`cannot parse ${file}: ${error.message}`)
}

requireObject(record, 'root')
requireEnum(record.policyVersion, ['hiveforge.intent-reality.v1'], 'policyVersion')

requireObject(record.work, 'work')
for (const key of ['id', 'title']) requireString(record.work[key], `work.${key}`)
requireEnum(record.work.scope, ['routine', 'substantial', 'critical'], 'work.scope')
requireArray(record.work.authority, 'work.authority')
record.work.authority.forEach((value, index) => requireString(value, `work.authority[${index}]`))

requireObject(record.intent, 'intent')
for (const key of ['productGoal', 'capability']) requireString(record.intent[key], `intent.${key}`)
for (const key of ['architecturalIntent', 'invariants', 'acceptanceEvidence']) {
  requireArray(record.intent[key], `intent.${key}`)
  record.intent[key].forEach((value, index) => requireString(value, `intent.${key}[${index}]`))
}

requireObject(record.execution, 'execution')
requireArray(record.execution.observedBehaviour, 'execution.observedBehaviour')
requireArray(record.execution.evidence, 'execution.evidence')
record.execution.evidence.forEach((item, index) => {
  requireObject(item, `execution.evidence[${index}]`)
  for (const key of ['kind', 'reference', 'result']) requireString(item[key], `execution.evidence[${index}].${key}`)
})

requireObject(record.conformance, 'conformance')
requireEnum(record.conformance.status, ['conforms', 'conforms-with-understood-divergence', 'incomplete'], 'conformance.status')
if (!Array.isArray(record.conformance.divergences)) fail('conformance.divergences must be an array')
record.conformance.divergences.forEach((item, index) => {
  requireObject(item, `conformance.divergences[${index}]`)
  for (const key of ['expected', 'observed']) requireString(item[key], `conformance.divergences[${index}].${key}`)
  requireEnum(item.classification, ['defect', 'stale-intent', 'environment', 'valid-undocumented-path', 'missing-test', 'architectural-weakness', 'authority-violation', 'other'], `conformance.divergences[${index}].classification`)
  requireEnum(item.status, ['open', 'understood', 'resolved', 'accepted-by-review'], `conformance.divergences[${index}].status`)
})

requireObject(record.completion, 'completion')
for (const key of ['capabilitySatisfied', 'invariantsPreserved', 'evidenceSufficient']) requireBoolean(record.completion[key], `completion.${key}`)
if ('reviewRequired' in record.completion) requireBoolean(record.completion.reviewRequired, 'completion.reviewRequired')

console.log(`Valid HiveForge conformance record: ${record.work.id}`)
