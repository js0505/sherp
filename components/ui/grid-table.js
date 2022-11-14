import { AgGridReact } from "ag-grid-react"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import { forwardRef } from "react"

function GridTable(props, ref) {
	const {
		columnDefs,
		rowData,
		onGridReady,
		onCellClicked,
		onCellEditRequest,
		readOnlyEdit = false,
		filter = false,
		floatingFilter = false,
		getRowId,
	} = props

	return (
		<>
			<div className="h-96 mt-5 mb-3 lg:h-[29rem]">
				<div className="ag-theme-alpine w-full h-full">
					<AgGridReact
						ref={ref}
						defaultColDef={{
							sortable: true,
							filter: filter,
							floatingFilter: floatingFilter,
						}}
						readOnlyEdit={readOnlyEdit}
						columnDefs={columnDefs}
						rowData={rowData}
						getRowId={getRowId}
						onGridReady={onGridReady}
						onCellClicked={onCellClicked}
						onCellEditRequest={onCellEditRequest}
					/>
				</div>
			</div>
		</>
	)
}

export default forwardRef(GridTable)
