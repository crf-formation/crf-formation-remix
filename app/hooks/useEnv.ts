import type { EnvProperty } from "~/services/env.server"
import useSsr from "./useSsr"

export default function useEnv() {
	const { isServer } = useSsr()
	
	function getEnv(propertyName: EnvProperty): string | undefined {
		if (isServer) {
			return process.env[propertyName]
		}
		return typeof window !== 'undefined' ? window.env[propertyName] : undefined
	}

	return {
		getEnv,
		isDev: (): boolean => {
			return getEnv('ENV') === 'dev'
		},
	}
}
