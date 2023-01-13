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
			<div className="mt-5 mb-3">
				<div className="ag-theme-alpine h-50vh lg:h-65vh">
					<AgGridReact
						ref={ref}
						defaultColDef={{
							resizable: true,
							sortable: true,
							filter: filter,
							floatingFilter: floatingFilter,
							cellStyle: {
								textAlign: "left",
								fontSize: "17px",
								paddingTop: "17px",
							},
							autoHeight: true,
						}}
						rowHeight={60}
						headerHeight={50}
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
