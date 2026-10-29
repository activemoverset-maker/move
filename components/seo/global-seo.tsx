import { JsonLd } from '@/components/json-ld'
import { generateOrganizationSchema, generateLocalBusinessSchema } from '@/lib/seo-utils'

export function GlobalSEO() {
  return (
    <>
      <JsonLd id="organization-schema" data={generateOrganizationSchema()} />
      <JsonLd id="local-business-schema" data={generateLocalBusinessSchema()} />
    </>
  )
}
