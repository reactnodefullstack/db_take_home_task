import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useRef, useState } from 'react';
import { Country } from '../../types/index'
import { useQuery } from "react-query";
import { useErrorBoundary } from 'react-error-boundary'
import Loader from '../../utils/Loader/index.tsx'
import './index.css';
import parse from 'html-react-parser'

interface processSelectedRowParams {
    obj: Object
    indent?: number
    htmlDetailsArray?: string[]
}

interface DisplayDetailsParams {
    country: Country
    htmlDetailsArray: String[]
    setSelectedRecordDisplay: Function
}

export default () => {
    const gridRef = useRef() as any;
    const { showBoundary } = useErrorBoundary()
    const [rowData, setRowData] = useState<Country[]>();
    const [selectedRecordDisplay,setSelectedRecordDisplay] = useState<Country>()
    const [htmlDetailsArrayState, setHtmlDetailsArrayState] = useState<string[]>([])
    let htmlDetailsArray:string[] = []

    const defaultColDef={
        sortable: true, 
        filter: true,
        resizable: true
    }
    const [colDefs, setColDefs] = useState([
        { field: 'Favorites',
            editable: true,
            width: 100,
            cellStyle: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            },
            headerClass: 'text-center',
            sortable: false, 
            filter: false,
            resizable: false,
            cellRenderer: (p)=>{
                const checked: boolean = JSON.parse(localStorage.getItem(p.data.name.official) as any) ? true : false
                const elm2: any = parse(`<input type='checkbox' ${checked?'checked':''} />`);
                return elm2;
            },
            cellRendererParams: {
                checkbox: true,
                disabled: false,
            },
        },
        { field: 'flag', 
            width: 100,
            cellStyle: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
            },
            headerClass: 'text-center',
        },
        { field: 'name.common',
            headerName: 'Name', 
        },
        { field: 'languages', 
            valueGetter: ({ data : { languages }}) => {
                return languages ? Object.values(languages) : ''
            } 
        },
        { field: 'currencies', 
            valueGetter: ({ data: { currencies } }) => {
                const currenciesArray:string[] = []
                if (currencies) {
                    Object.keys(currencies).forEach(function(key) {
                        currenciesArray.push(currencies[key].name)
                    });
                }
                return currenciesArray
            } 
        },
        { field: 'population',
            type: 'rightAligned',
            valueFormatter: ({data: {population}}) =>  {
            return population.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            }
        },
    ])
  
    const onCellClicked = (e) => {
        if (e.column.colId === 'Favorites') {
            localStorage.setItem(e.data.name.official, JSON.stringify(e.event.target.checked));
        } else {
            const selectedRows = gridRef?.current.api.getSelectedRows();
            htmlDetailsArray = ["<div class='details'>"]
            htmlDetailsArray = processSelectedRow({obj: selectedRows[0], htmlDetailsArray})
            htmlDetailsArray.push('</div>')
            setHtmlDetailsArrayState(htmlDetailsArray)
            setSelectedRecordDisplay(selectedRows[0])
        }
    }

    const processSelectedRow = ({obj, indent = 0, htmlDetailsArray=[]}:processSelectedRowParams) => {
        for (const [key, value] of Object.entries(obj)) {
            if (key === 'latlng') {
                htmlDetailsArray.push(`<div class='value margin${indent}'><div class='bold key'>${key}</div><div class='property'>${value.join(', ')}</div></div>`)
            } else if (Array.isArray(value)) {
                let count = 0;
                for (const arrEntry of value) {
                    count += 1
                    if (count === 1) {
                        htmlDetailsArray.push(`<div class='bold margin${indent}'>${key}</div><div class='bold margin${indent}'>${arrEntry}</div>`)
                    } else {
                        htmlDetailsArray.push(`<div class='bold margin${indent}'>${arrEntry}</div>`)
                    }
                }
            } else if (typeof value === "object" && Object.keys(value).length > 0) {
                htmlDetailsArray.push(`<div class='bold margin${indent}'>${key}</div>`)
                processSelectedRow({obj:value, indent: indent+1, htmlDetailsArray})
            } else {
                htmlDetailsArray.push(`<div class='value margin${indent}'><div class='bold key'>${key}</div><div class='property'>${value}</div></div>`)
            }
        }
        return htmlDetailsArray
    }

    const retrieveCountries = async () => {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const responseJson = await response.json();
        if (responseJson?.message) {
            return responseJson
        }
        return responseJson;
    };
    const { data: countries, error, isLoading } = useQuery("retrieveCountries", retrieveCountries);

    if (error || (countries && countries.message)) {
        showBoundary(error || countries.message)
    }
  return (
    <>
        {isLoading && <Loader/>}
        {!selectedRecordDisplay && !isLoading && !error && <div>
            <div className="pageHeader">
                <div className="pageTitle">
                    Countries list
                </div>
            </div>
            <div className="ag-theme-quartz">
                <AgGridReact 
                    ref={gridRef}
                    headerHeight={50} 
                    rowSelection={"single"}
                    onCellClicked={onCellClicked}
                    pagination={true}
                    rowData={countries} 
                    defaultColDef={defaultColDef}
                    
                    columnDefs={colDefs as any} />
            </div>
        </div>}
        {selectedRecordDisplay && 
            <>
                <DetailsDisplay
                    country={selectedRecordDisplay}
                    htmlDetailsArray={htmlDetailsArrayState}
                    setSelectedRecordDisplay={setSelectedRecordDisplay}
                />
            </>}
    </>
  )
  ;
}



const DetailsDisplay = (props: DisplayDetailsParams) => {
    const { country, htmlDetailsArray, setSelectedRecordDisplay } = props
    return (
        <>
            <div className='detailsHeader'>
                Country: {country.name.common}
            </div>
            {parse(htmlDetailsArray.join(''))}
            <div className='detailsFooter'>
                <div className="okButton" onClick={()=>{setSelectedRecordDisplay(undefined)}}>
                    OK
                </div>
            </div>
        </>
    )
}