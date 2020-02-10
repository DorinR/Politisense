
import React, { useEffect } from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

export default function MinisterHelpDialog (props) {
  const { onClose, open } = props
  const [text, setText] = React.useState('')

  useEffect(() => {
    getHelpText(props.minister)
  }, [props.minister])

  const getHelpText = (minister) => {
    let description = ''
    switch (minister) {
      case 'inter':
        description = 'Responsible for the federal government\'s relations with the governments of the provinces and territories of Canada.' +
                    ' The Minister of Intergovernmental Affairs does not head a full-fledged department, ' +
                    'but rather directs the Intergovernmental Affairs Secretariat within the Privy Council Office'
        break
      case 'veteran':
        description = 'Responsible for pensions, benefits and services for war veterans, ' +
                    'retired and still-serving members of the Canadian Armed Forces and Royal Canadian Mounted Police (RCMP), ' +
                    'their families, as well as some civilians. Responsible for various files within the defence department as ' +
                    'assigned by the Prime Minister or Defence Minister.'
        break
      case 'crown-indigenous':
        description = 'One of two Canadian cabinet ministers who administer Crown-Indigenous Relations and Northern Affairs Canada (CIRNAC), ' +
                    'which is responsible for administering the Indian Act and other legislation dealing with "Indians and lands reserved for the Indians" under ' +
                    'subsection 91(24) of the Constitution Act, 1867. ' +
                    'The minister is also more broadly responsible for overall relations between the federal government and First Nations, Métis, and Inuit.'
        break
      case 'queen':
        description = 'in charge of the Privy Council Office. The President of the Privy Council also has the largely ceremonial duty of presiding ' +
                    'over meetings of the Queen\'s Privy Council for Canada, a body which only convenes in full for affairs of state such as the accession of a ' +
                    'new Sovereign or the marriage of the Prince of Wales or heir presumptive to the Throne (see Monarchy in Canada). '
        break
      case 'science':
        description = 'Responsible for overseeing the federal government\'s economic development and corporate affairs department, Innovation, Science and ' +
                    'Economic Development Canada. ' +
                    'The Minister of Innovation, Science and Industry is also the minister responsible for Statistics Canada. '
        break
      case 'finance':
        description = 'Responsible each year for presenting the federal government\'s budget. It is one of the most important positions in the Cabinet.'
        break
      case 'treasury':
        description = 'Responsible for accounting for the government\'s fiscal operations.'
        break
      case 'transport':
        description = 'Responsible for overseeing the federal government\'s transportation regulatory and development department, Transport Canada, ' +
                    'as well as Canada Post, the Saint Lawrence Seaway, Nav Canada, and the Port Authority system.['
        break
      case 'agri':
        description = 'Responsible for overseeing several organizations including Agriculture and Agri-Food Canada, ' +
                    'Canadian Dairy Commission, Farm Credit Canada, ' +
                    'Canadian Food Inspection Agency, National Farm Products Council and the Canadian Grain Commission. '
        break
      case 'economy':
        description = 'Responsible for Canada\'s six regional development agencies: the Atlantic Canada Opportunities Agency, ' +
                    'the Canadian Northern Economic Development Agency, the Economic Development Agency of Canada for the Regions of Quebec, the Federal ' +
                    'Economic Development Agency for Southern Ontario, ' +
                    'the Federal Economic Development Initiative for Northern Ontario, and Western Economic Diversification Canada.'
        break
      case 'revenue':
        description = 'Responsible for the Canada Revenue Agency and the administration of taxation law and collection.'
        break
      case 'infra':
        description = 'Responsible for the development of Canada\'s infrastructure. ' +
                    'Infrastructure Canada and the Canada Infrastructure Bank report directly to the Minister of Infrastructure and Communities.'
        break
      case 'defence':
        description = 'Responsible for the management and direction of all matters relating to the national defence of Canada. ' +
                    'The Department of National Defence is headed by the Deputy Minister of National Defence, the department\'s senior civil servant, ' +
                    'while the Canadian Armed Forces are headed by the Chief of the Defence Staff, Canada\'s senior serving military officer.['
        break
      case 'rural':
        description = 'Responsible for Status of Women Canada, an agency under the Department of Canadian Heritage.'
        break
      case 'employment':
        description = 'Responsible for setting national labour standards and federal labour dispute mechanisms.[2] Most of ' +
                    'the responsibility for labour belongs with the provinces; however, ' +
                    'the federal government is responsible for labour issues in industries under its jurisdiction.'
        break
      case 'health':
        description = 'Responsible for overseeing health-focused government agencies including Health Canada and the Public Health Agency of Canada, ' +
                    'as well as enforcing the Canada Health Act (the law governing Canada\'s universal health care system). '
        break
      case 'diversity':
        description = 'Responsible for multiculturalism from the former Minister of Multiculturalism and Citizenship'
        break
      case 'foreign':
        description = 'Responsible for overseeing the federal government\'s international relations and heads the Department of Global Affairs, ' +
                    'though the Minister of International Trade leads on international trade issues. In addition to the Department, the Minister ' +
                    'is also the lead in overseeing the ' +
                    'International Centre for Human Rights and Democratic Development and the International Development Research Centre.'
        break
      case 'inter-dev':
        description = 'Responsible for the international development portfolio and is one of the three ministers (along with the Minister of Foreign Affairs ' +
                    'and the Minister of International Trade) who lead the Canadian foreign ministry, Global Affairs Canada.'
        break
      case 'family':
        description = 'Responsible for Employment and Social Development Canada, the federal department that oversees programs such as Employment Insurance, ' +
                    'Canada Pension Plan, Old Age Security, and Canada Student Loans. The Minister is also in charge of Service Canada.'
        break
      case 'natural':
        description = 'Responsible for Natural Resources Canada.'
        break
      case 'commons':
        description = 'Responsible for planning and managing the government\'s legislative program in the House of Commons of Canada.'
        break
      case 'safety':
        description = 'Responsible for overseeing the federal government\'s domestic security department, Public Safety Canada.'
        break
      case 'small':
        description = 'Responsible for the department Innovation, Science and Economic Development Canada; ' +
                    'the others being the Minister of Innovation, Science and Economic Development and the Minister of Science.' +
                    '\nResponsible for the international ' +
                    'trade portfolio and is one of the three ministers (along with the Minister of Foreign Affairs and the Minister of ' +
                    'International Development and La Francophonie) who lead the Canadian foreign ministry, Global Affairs Canada.'
        break
      case 'climate':
        description = 'Responsible for overseeing the federal government\'s environment department, Environment and Climate Change Canada. ' +
                    'The Minister is also responsible for overseeing Parks Canada and the Canadian Environmental Assessment Agency.'
        break
      case 'justice':
        description = 'Responsible for the Department of Justice and the Justice Portfolio. Acting as Attorney General ' +
                    'the MoJAG litigates on behalf of the Crown and serves as the chief legal advisor to the Government of Canada. Most prosecution functions of ' +
                    'the Attorney General have been assigned to the Public Prosecution Service of Canada. The Attorney General ' +
                    'is supported in this role by the Director of Public Prosecutions.'
        break
      case 'fish':
        description = 'Responsible for supervising the fishing industry, administrating all navigable waterways in the country, ' +
                    'and overseeing the operations of the Canadian Coast Guard and the Freshwater Fish Marketing Corporation.'
        break
      case 'digital':
        description = 'This ministry was introduced in the 29th Canadian ministry under Prime Minister Justin Trudeau.'
        break
      case 'public':
        description = 'Responsible for overseeing the federal government\'s "common service organization" (Public Services and Procurement Canada), ' +
                    'an expansive department responsible for the internal servicing and administration of the federal government. A flavour for the Department is ' +
                    'given by the list of Acts and Regulations for which the Ministry is responsible overview page. ' +
                    'The Minister of Public Services and Procurement is also the Receiver General for Canada. '
        break
      case 'finance-assoc':
        description = 'Responsible for various files within the finance department as assigned by the Finance Minister.'
        break
      case 'heritage':
        description = 'Responsible for culture, media, sports, and the arts in Canada.'
        break
      case 'immigration':
        description = 'Responsible for Immigration, Refugees and Citizenship Canada: the federal government department responsible for immigration, ' +
                    'refugee and citizenship issues. ' +
                    'The Minister is also responsible for the Immigration and Refugee Board.'
        break
      case 'indigenous':
        description = 'Responsible for overseeing the federal government department Indigenous and Northern Affairs Canada.'
        break
      case 'seniors':
        description = 'New portfolio introduced during the government of Justin Trudeau, in July 2018.'
        break
      case 'north':
        description = 'In 1953, the role of Minister of Northern Affairs and National Resources was created as a formal successor to the Minister ' +
                    'of Resources and Development, receiving the previous position\'s roles with an additional focus on territorial and Inuit relations. ' +
                    'Similarly, the Department of Northern Affairs and National Resources was created in ' +
                    'the same legislation to replace the previous Department of Resources and Development.'
        break
      default:
        description = 'No description available'
    }
    setText(description)
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog onClose={handleClose} open={open} TransitionComponent={props.transition}>
      <DialogTitle>Role of the minister</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
