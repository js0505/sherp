import { AgGridReact } from "@ag-grid-community/react"
import { forwardRef } from "react"
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model"

import "@ag-grid-community/styles/ag-grid.css"
import "@ag-grid-community/styles/ag-theme-alpine.css"
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
						modules={[ClientSideRowModelModule]}
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
						suppressDragLeaveHidesColumns={true}
					/>
				</div>
			</div>
		</>
	)
}

export default forwardRef(GridTable)
