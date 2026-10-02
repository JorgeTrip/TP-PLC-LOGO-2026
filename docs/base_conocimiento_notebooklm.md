# 🧠 Base de Conocimientos: NotebookLM de Tecnologías para la Automatización

Este proyecto está formalmente vinculado al cuaderno de **NotebookLM** de la cátedra para servir como fuente de verdad teórica y técnica ante cualquier modificación o extensión.

---

## 📌 Datos de Vinculación

- **Título del Cuaderno:** Tecnologías para la automatización
- **ID:** `531c7300-67a1-4422-a91c-b90f6193aa62`
- **Alias configurados:** `tpa`, `tecnologias_automatizacion`
- **URL web:** [Cuaderno en NotebookLM](https://notebook.google.com/notebook/531c7300-67a1-4422-a91c-b90f6193aa62)
- **Cantidad de fuentes:** 26 documentos (apuntes oficiales, presentaciones, grabaciones de audio y clases).

---

## 📚 Principales Fuentes de Consulta para el TP PLC

1. **Grabación de clase 25/09/2026 (`20260925_210954 Tecnología Control - Ladder logic IDE y TP PLC.mp3`):**
   - Presentación oficial de consignas, ejercicios del TP, hardware de entradas (NA/NC) y criterios de evaluación.
2. **Apunte de Cátedra (`2026-09-25 Apunte - Controladores Logicos Programables.pdf`):**
   - Funcionamiento del ciclo de scan, temporizadores TON/TOF/TP, contadores y ejemplo integrador con biestables RS.
3. **Diapositivas (`2026-09-25 Diapos de la Clase - Controladores Logicos Programables.pdf`):**
   - Diagramas Ladder normalizados, tablas de símbolos y asignación de variables.
4. **Teoría de Control y Sistemas Lineales:**
   - Álgebra de bloques, funciones de transferencia y estabilidad.

---

## 🛠️ Cómo Consultar el Cuaderno desde Antigravity

El MCP server `notebooklm` permite consultar el cuaderno directamente mediante los alias configurados (`tpa` o `tecnologias_automatizacion`):

```json
{
  "ServerName": "notebooklm",
  "ToolName": "notebook_query",
  "Arguments": {
    "notebook_id": "tpa",
    "query": "¿Cuáles son las condiciones de temporización y reseteo del ejercicio de alarma multifunción?"
  }
}
```

Para listar detalles o fuentes específicas:
- `notebook_get`: con `notebook_id: "tpa"`
- `source_describe`: para examinar una fuente puntual
- `source_get_content`: para leer pasajes específicos
